import * as THREE from "three";
import { Movement } from "../entities/Movement.js";
import { Item } from "../entities/Items.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { GuardState, AlertState, PlayerState } from "../robots/states.js";

class Forklift extends Entity {
  constructor(params = {}) {
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

    if (params.position instanceof THREE.Vector3) {
      this.position.copy(params.position);
    } else {
      this.position.set(0, 0, 0);
    }

    if (this.mesh) {
      this.mesh.scale.set(5, 5, 5);
      this.mesh.position.set(0, 4, -2);
      this.mesh.rotation.y = -Math.PI / 2;
    }

    this.state = new GuardState(this, {
      circleDistance: 2,
      circleRadius: 1,
      jitterAmount: 0.3,
    });

    this.mode = "forklift";
    this.lastModeToggleTime = 0;
    this.modeToggleCooldown = 1000;

    this.forkliftMesh = this.mesh ? this.mesh.clone() : null;
    this.transformerMesh = assetLoader.clone("transformer");

    this._setForkliftParameters();
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

  toggleMode() {
    const now = performance.now();
    if (now - this.lastModeToggleTime < this.modeToggleCooldown) return;
    if (this.mode === "forklift") {
      this.convertToTransformer();
    } else {
      this.convertToForklift();
    }
    this.lastModeToggleTime = now;
  }

  convertToTransformer() {
    console.log("//JAMES: transitioning to transformer mode.");
    if (this.mesh && this.forkliftMesh) {
      this.model.remove(this.mesh);
    }
    const ariseMesh = assetLoader.clone("forkliftUp");
    this.mesh = ariseMesh;
    this.model.add(this.mesh);

    const mixer = new THREE.AnimationMixer(this.mesh);
    const clips = assetLoader.getClips("forkliftUp");
    if (!clips || clips.length === 0) {
      console.error("//JAMES: forkliftUp animation not found.");
      return;
    }
    const action = mixer.clipAction(clips[0]);
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    action.play();
    console.log("//JAMES: playing forkliftUp animation forward.");

    mixer.addEventListener("finished", () => {
      this.model.remove(this.mesh);
      this.mesh = this.transformerMesh.clone();
      this.model.add(this.mesh);

      const currentSpeed = this.movement.velocity.length();
      if (currentSpeed > 5) {
        const runClips = assetLoader.getClips("forkliftRunning");
        if (runClips && runClips.length > 0) {
          const runAction = this.mixer.clipAction(runClips[0]);
          runAction.setLoop(THREE.LoopRepeat);
          runAction.play();
          runAction.timeScale = currentSpeed / 8;
        }
      } else {
        const walkClips = assetLoader.getClips("forkliftWalking");
        if (walkClips && walkClips.length > 0) {
          const walkAction = this.mixer.clipAction(walkClips[0]);
          walkAction.setLoop(THREE.LoopRepeat);
          walkAction.play();
          walkAction.timeScale = currentSpeed / 8;
        }
      }

      this._setTransformerParameters();
      this.mode = "transformer";
      console.log("//JAMES: transformer mode active.");
    });

    this.mixer = mixer;
  }

  convertToForklift() {
    console.log("//JAMES: transitioning to forklift mode.");
    if (this.mesh && this.transformerMesh) {
      this.model.remove(this.mesh);
    }

    const ariseMesh = assetLoader.clone("forkliftUp");
    this.mesh = ariseMesh;
    this.model.add(this.mesh);

    const mixer = new THREE.AnimationMixer(this.mesh);
    const clips = assetLoader.getClips("forkliftUp");
    if (!clips || clips.length === 0) {
      console.error("//JAMES: forkliftUp animation not found.");
      return;
    }
    const action = mixer.clipAction(clips[0]);
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    action.timeScale = -1;
    action.time = clips[0].duration;
    action.play();
    console.log("//JAMES: playing forkliftUp animation in reverse.");

    mixer.addEventListener("finished", () => {
      this.model.remove(this.mesh);
      this.mesh = this.forkliftMesh.clone();
      this.model.add(this.mesh);

      const currentSpeed = this.movement.velocity.length();
      const walkClips = assetLoader.getClips("forkliftWalking");
      if (walkClips && walkClips.length > 0) {
        const walkAction = this.mixer.clipAction(walkClips[0]);
        walkAction.setLoop(THREE.LoopRepeat);
        walkAction.play();
        walkAction.timeScale = currentSpeed / 8;
      }

      this._setForkliftParameters();
      this.mode = "forklift";
      console.log("//JAMES: forklift mode active.");
    });

    this.mixer = mixer;
  }

  updateForkliftMode(delta) {
    if (window.controller?.isControlActive("altMovement")) {
      this.toggleMode();
    }
  }

  update(delta) {
    super.update(delta);
    this.updateForkliftMode(delta);
  }
}

export async function createForklift(position) {
  try {
    await assetLoader.load(
      "forklift",
      "/models/robots/Forklift_Bot_0404141540_texture.glb",
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
