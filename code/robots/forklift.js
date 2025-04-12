// robots/forklift.js
//JAMES: Forklift entity class with state support. If player-controlled, it uses the default
//JAMES: entity update; otherwise it applies AI steering from its current state.
import * as THREE from "three";
import { Movement } from "../entities/Movement.js";
import { Item } from "../entities/Items.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
//JAMES: Import the state classes.
import { GuardState, PlayerState, AlertState } from "../robots/states.js";

class Forklift extends Entity {
  constructor(params = {}) {
    //JAMES: Set up basic properties.
    params.name = "forklift";
    params.health = 150;
    params.armor = 90;
    params.movement = new Movement("wheels", 8, 1); //JAMES: Slightly slower than vacuum.
    params.item = new Item();
    //JAMES: Lower turning acceleration for the forklift.
    params.movement.turningAccelerationFactor = 5;
    //JAMES: Delete any provided model so that the parent's constructor creates a fresh Group.
    delete params.model;

    this.setMovable(true);
    //JAMES: Call the Entity constructor.
    super(params);

    //JAMES: Mark this entity as a robot and hackable.
    this.is_robot = true;
    this.is_hackable = true;

    this.isMovable = true;
    //JAMES: Set initial position.
    if (params.position instanceof THREE.Vector3) {
      this.position.copy(params.position);
    } else {
      this.position.set(0, 0, 0);
    }

    //JAMES: Adjust visual properties of the forklift's mesh if available.
    if (this.mesh) {
      //JAMES: Scale the mesh.
      this.mesh.scale.set(5, 5, 5);
      //JAMES: Reposition the mesh within its group.
      this.mesh.position.set(0, 4, -2);
      //JAMES: Rotate the mesh so that it faces correctly.
      this.mesh.rotation.y = -Math.PI / 2;
    }

    //JAMES: Set the initial AI state to GuardState.
    this.state = new GuardState(this, {
      circleDistance: 2,
      circleRadius: 1,
      jitterAmount: 0.3,
    });
  }

  //JAMES: Override the update method.
  update(delta) {
    //JAMES: If this forklift is controlled by the player, use the default Entity update.
    if (this === window.player && window.controller) {
      super.update(delta);
    } else {
      //JAMES: For AI-controlled forklifts, if a state exists, get its steering force.
      if (this.state) {
        const steeringForce = this.state.update(delta);
        //JAMES: Clamp the steering force to the maximum allowed force.
        steeringForce.clampLength(0, this.movement.maxForce);
        this.movement.acceleration.add(steeringForce);
      }

      //JAMES: Apply friction and static friction.
      this.movement.applyFriction();
      this.movement.applyStaticFriction();

      //JAMES: Update the linear velocity based on the current acceleration.
      this.movement.updateLinear(delta, this.getForwardDirection());
      //JAMES: Update the entity's position.
      this.position.add(this.movement.velocity.clone().multiplyScalar(delta));
      //JAMES: Reset acceleration for the next frame.
      this.movement.acceleration.set(0, 0, 0);

      //JAMES: Move the model to match the new position.
      this.model.position.copy(this.position);

      //JAMES: Update lights and (if player-controlled) update the camera.
      this.updateHeadlights();
      if (this === window.player && window.cameraManager) {
        window.cameraManager.followObject(this);
      }

      //JAMES: Update the bounding box.
      this.updateBoundingBox();
    }
  }
}

/**
 * createForklift
 * —————————
 * Loads the forklift asset (if not already loaded), instantiates a Forklift entity,
 * applies scaling and positioning adjustments, and registers it with the EntityManager.
 *
 * @param {THREE.Vector3} position — The world position for the forklift.
 * @returns {Promise<Forklift>} The instantiated Forklift entity.
 */
export async function createForklift(position) {
  try {
    //JAMES: Load (and cache) the forklift model.
    await assetLoader.load(
      "forklift",
      "/models/robots/Forklift_Bot_0404141540_texture.glb",
    );

    //JAMES: Clone the forklift model.
    const forkliftModel = assetLoader.clone("forklift");
    if (!forkliftModel) {
      throw new Error("Forklift model not found after loading.");
    }
    //JAMES: Scale and adjust the model.
    forkliftModel.scale.set(5, 5, 5);
    const bbox = new THREE.Box3().setFromObject(forkliftModel);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    forkliftModel.position.sub(center);
    forkliftModel.position.y = bbox.min.y;
    //JAMES: Create the Forklift entity using the asset as the mesh.
    const forklift = new Forklift({
      position:
        position instanceof THREE.Vector3 ? position : new THREE.Vector3(),
      mesh: forkliftModel,
    });

    //JAMES: Register the forklift with the EntityManager.
    entityManager.addEntity(forklift);
    window.forklift = forklift;

    return forklift;
  } catch (error) {
    console.error("Error loading forklift model:", error);
    throw error;
  }
}

export { Forklift };
