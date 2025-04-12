// robots/drone.js
"use strict";

import * as THREE from "three";
import { Movement } from "../entities/Movement.js";
import { Item } from "../entities/Items.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { WanderBehaviour } from "../robots/behaviours.js";

//
// Drone Class
//JAMES: This class defines a Drone robot that can be controlled by a player or by AI.
//JAMES: The drone is similar to the vacuum entity but has legs (i.e., this.has_legs=true) so that it can use steps.
//JAMES: It also uses a wander behavior when not controlled by the player.
//
class Drone extends Entity {
  constructor(params = {}) {
    //JAMES: Set up required properties for the drone.
    params.name = "drone";
    params.health = 120;
    params.armor = 80;
    params.movement = new Movement("wheels", 25, 3); //JAMES: Slightly faster top speed than the vacuum.
    params.item = new Item();
    params.movement.turningAccelerationFactor = 50;

    //JAMES: Call the parent constructor for base initialization.
    super(params);

    this.isMovable = true;
    this.setMovable(true);
    //JAMES: Mark as a robot that can be hacked.
    this.is_robot = true;
    this.is_hackable = true;
    //JAMES: This drone has legs (or equivalent mobility) so it can handle steps.
    this.has_legs = true;
    //JAMES: Set the drone's position.
    if (params.position instanceof THREE.Vector3) {
      this.position.copy(params.position);
    } else {
      this.position.set(0, 0, 0);
    }

    //JAMES: Clone the loaded GLTF scene graph for our mesh.
    this.mesh = params.model.clone();
    this.mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    //JAMES: Use the cloned mesh as the visual model.
    this.model = this.mesh;
    this.mesh.position.copy(this.position);

    //JAMES: Enable lights if available.
    this.enableBulbLight?.();
    this.enableHeadlights?.();

    //JAMES: Assign the wander behavior to the drone.
    this.behaviour = new WanderBehaviour(this, {
      circleDistance: 2, // How far ahead to project the wander circle.
      circleRadius: 1, // Radius of the wander circle.
      jitterAmount: 0.3, // How much the wander target jitters each frame.
    });
  }
}

//
// createDrone - Factory function to load the drone asset and instantiate a Drone entity.
//JAMES: Loads the drone model (if not already cached), creates a Drone entity with the given position, and registers it with the EntityManager.
export async function createDrone(position) {
  try {
    await assetLoader.load(
      "drone",
      "/models/robots/Red_Aerial_Explorer_0404141527_texture.glb",
    );

    //JAMES: Clone the drone model from the asset loader.
    const droneModel = assetLoader.clone("drone");
    if (!droneModel) {
      throw new Error("Drone model not found after loading.");
    }

    //JAMES: Create the Drone entity using the cloned model.
    const drone = new Drone({
      position:
        position instanceof THREE.Vector3 ? position : new THREE.Vector3(),
      model: droneModel,
    });

    //JAMES: Register the drone entity with the entity manager and expose it globally (for debugging).
    entityManager.addEntity(drone);
    window.drone = drone;

    return drone;
  } catch (error) {
    console.error("Error loading drone model:", error);
    throw error;
  }
}

export { Drone };
