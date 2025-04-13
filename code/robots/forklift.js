// robots/forklift.js
"use strict";

import * as THREE from "three";
import { Movement } from "../entities/Movement.js";
import { Item } from "../entities/Items.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { GuardState } from "../robots/states.js";

class Forklift extends Entity {
  constructor(params = {}) {
    // JAMES: Set basic forklift properties.
    params.name = "forklift";
    params.health = 150;
    params.armor = 150;
    params.movement = new Movement("wheels", 8, 1);
    params.item = new Item();
    params.movement.turningAccelerationFactor = 5;
    delete params.model;

    super(params);
    this.setMovable(true);
    this.is_robot = true;
    this.is_hackable = true;

    // JAMES: Set initial position.
    if (params.position instanceof THREE.Vector3) {
      this.position.copy(params.position);
    } else {
      this.position.set(0, 0, 0);
    }

    // JAMES: Configure the initial forklift mesh.
    if (this.mesh) {
      this.mesh.scale.set(5, 5, 5);
      this.mesh.position.set(0, 4, -2);
      this.mesh.rotation.y = -Math.PI / 2;
    }

    // JAMES: Set initial AI state (guard state for non–player control).
    this.state = new GuardState(this, {
      circleDistance: 2,
      circleRadius: 1,
      jitterAmount: 0.3,
    });

    // JAMES: Initialize mode properties.
    this.mode = "forklift"; // possible values: "forklift" or "transformer"
    this.lastModeToggleTime = 0;
    this.modeToggleCooldown = 1000; // ms
    this.inTransition = false;
    this.currentAction = null; // persistent animation action

    // JAMES: Save the original forklift mesh for later reversion.
    this.forkliftMesh = this.mesh ? this.mesh.clone() : null;
    // JAMES: Preload the transformer mesh.
    this.transformerMesh = assetLoader.clone("transformer");

    // JAMES: Define scaling variables.
    this.forkliftScale = new THREE.Vector3(5, 5, 5);
    this.transformerScale = new THREE.Vector3(5, 5, 5); // adjust as needed

    // JAMES: Set forklift-specific parameters.
    this._setForkliftParameters();

    // JAMES: Create a persistent AnimationMixer for this forklift.
    this.mixer = new THREE.AnimationMixer(this.model);
  }

  _setForkliftParameters() {
    this.movement.topSpeed = 8;
    this.movement.turningAccelerationFactor = 5;
    this.armor = 150;
  }

  _setTransformerParameters() {
    this.movement.topSpeed = 20;
    this.movement.turningAccelerationFactor = 10;
    this.armor = 50;
  }

  // JAMES: Toggle mode if the altMovement key is pressed.
  toggleMode() {
    const now = performance.now();
    if (
      now - this.lastModeToggleTime < this.modeToggleCooldown ||
      this.inTransition
    )
      return;
    if (this.mode === "forklift") {
      this.convertToTransformer();
    } else {
      this.convertToForklift();
    }
    this.lastModeToggleTime = now;
  }

  // JAMES: Transition to transformer mode.
  convertToTransformer() {
    console.log("//JAMES: transitioning to transformer mode.");
    this.inTransition = true;
    if (this.mesh && this.forkliftMesh) {
      this.model.remove(this.mesh);
    }
    // JAMES: Swap in the arise animation mesh.
    const ariseMesh = assetLoader.clone("forkliftUp");
    this.mesh = ariseMesh;
    this.model.add(this.mesh);

    const tempMixer = new THREE.AnimationMixer(this.mesh);
    const clips = assetLoader.getClips("forkliftUp");
    if (!clips || clips.length === 0) {
      console.error("//JAMES: forkliftUp animation not found.");
      this.inTransition = false;
      return;
    }
    const action = tempMixer.clipAction(clips[0]);
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    action.play();
    console.log("//JAMES: playing forkliftUp animation forward.");

    tempMixer.addEventListener("finished", () => {
      this.model.remove(this.mesh);
      // JAMES: Swap to the transformer mesh.
      this.mesh = this.transformerMesh.clone();
      this.mesh.scale.copy(this.transformerScale);
      this.model.add(this.mesh);
      this._setTransformerParameters();
      this.mode = "transformer";
      this.inTransition = false;
      this.currentAction = null;
      console.log("//JAMES: transformer mode active.");
    });
    this.mixer = tempMixer;
  }

  // JAMES: Transition back to forklift mode.
  convertToForklift() {
    console.log("//JAMES: transitioning to forklift mode.");
    this.inTransition = true;
    if (this.mesh && this.transformerMesh) {
      this.model.remove(this.mesh);
    }
    // JAMES: Swap in the arise animation mesh and play in reverse.
    const ariseMesh = assetLoader.clone("forkliftUp");
    this.mesh = ariseMesh;
    this.model.add(this.mesh);

    const tempMixer = new THREE.AnimationMixer(this.mesh);
    const clips = assetLoader.getClips("forkliftUp");
    if (!clips || clips.length === 0) {
      console.error("//JAMES: forkliftUp animation not found.");
      this.inTransition = false;
      return;
    }
    const action = tempMixer.clipAction(clips[0]);
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    action.timeScale = -1; // reverse playback
    action.time = clips[0].duration; // start at the end
    action.play();
    console.log("//JAMES: playing forkliftUp animation in reverse.");

    tempMixer.addEventListener("finished", () => {
      this.model.remove(this.mesh);
      // JAMES: Swap back to the original forklift mesh.
      this.mesh = this.forkliftMesh.clone();
      this.mesh.scale.copy(this.forkliftScale);
      this.model.add(this.mesh);
      this._setForkliftParameters();
      this.mode = "forklift";
      this.inTransition = false;
      this.currentAction = null;
      console.log("//JAMES: forklift mode active.");
    });
    this.mixer = tempMixer;
  }

  // JAMES: Update persistent mode animations based on current speed.
  updateForkliftMode(delta) {
    if (window.controller?.isControlActive("altMovement")) {
      this.toggleMode();
    }
    if (!this.inTransition) {
      const currentSpeed = this.movement.velocity.length();
      let action;
      if (this.mode === "transformer") {
        if (currentSpeed > 5) {
          const runClips = assetLoader.getClips("forkliftRunning");
          if (runClips && runClips.length > 0) {
            action = this.mixer.clipAction(runClips[0]);
          }
        } else {
          const walkClips = assetLoader.getClips("forkliftWalking");
          if (walkClips && walkClips.length > 0) {
            action = this.mixer.clipAction(walkClips[0]);
          }
        }
      } else {
        const walkClips = assetLoader.getClips("forkliftWalking");
        if (walkClips && walkClips.length > 0) {
          action = this.mixer.clipAction(walkClips[0]);
        }
      }
      if (action && this.currentAction !== action) {
        if (this.currentAction) {
          this.currentAction.stop();
        }
        action.setLoop(THREE.LoopRepeat);
        action.play();
        this.currentAction = action;
      }
      if (this.currentAction) {
        // JAMES: Adjust timescale based on current speed.
        this.currentAction.timeScale = currentSpeed / 8;
      }
    }
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }

  // JAMES: Override update to include forklift mode update.
  update(delta) {
    super.update(delta);
    this.updateForkliftMode(delta);
  }
}

export async function createForklift(position) {
  try {
    await assetLoader.load(
      "forklift",
      "/models/robots/forklift_bot_0404141540_texture.glb",
    );
    const forkliftModel = assetLoader.clone("forklift");
    if (!forkliftModel) throw new Error("Forklift model not found.");
    forkliftModel.scale.set(5, 5, 5);
    const bbox = new THREE.Box3().setFromObject(forkliftModel);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    forkliftModel.position.sub(center);
    forkliftModel.position.y = bbox.min.y;

    const forklift = new Forklift({
      position:
        position instanceof THREE.Vector3 ? position : new THREE.Vector3(),
      mesh: forkliftModel,
    });

    entityManager.addEntity(forklift);
    window.forklift = forklift;
    return forklift;
  } catch (error) {
    console.error("Error loading forklift:", error);
    throw error;
  }
}

export { Forklift };
