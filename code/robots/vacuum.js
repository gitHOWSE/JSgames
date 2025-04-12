// robots/vacuum.js
"use strict";

import * as THREE from "three";
import { Movement } from "../entities/Movement.js";
import { Item } from "../entities/Items.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";

import { WanderBehaviour } from "../robots/behaviours.js";

class Vacuum extends Entity {
  constructor(params = {}) {
    //JAMES: Ensure the params object has all the bits Entity needs
    params.name = "vacuum";
    params.health = 100;
    params.armor = 60;
    params.movement = new Movement("wheels", 5, 1);
    params.item = new Item();

    //JAMES: Turning and force.
    params.movement.turningAccelerationFactor = 50;
    //JAMES: Call the parent constructor with params object
    super(params);

    this.isMovable = true;
    this.setMovable(true);
    this.is_robot = true;
    this.is_hackable = true;

    //JAMES: Position the vacuum if provided
    if (params.position instanceof THREE.Vector3) {
      this.position.copy(params.position);
    } else {
      this.position.set(0, 0, 0);
    }

    //JAMES: Clone the loaded GLTF scene graph for our mesh
    this.mesh = params.model.clone();
    this.mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.model = this.mesh;
    this.mesh.position.copy(this.position);

    this.enableBulbLight?.();
    this.enableHeadlights?.();
    this.behaviour = new WanderBehaviour(this, {
      circleDistance: 2, // how far ahead the wander circle is
      circleRadius: 1, // radius of that circle
      jitterAmount: 0.3, // how much the wander target jitters each frame
    });
  }
}

/**
 * createVacuum
 * —————————
 * Loads the vacuum asset (if not already loaded), instantiates
 * a Vacuum entity, and registers it with the EntityManager.
 */
export async function createVacuum(position) {
  try {
    //JAMES: Load (and cache) the vacuum model once
    await assetLoader.load(
      "vacuum",
      "/models/robots/Robotic_Vacuum_Charm_0404141555_texture.glb",
    );

    //JAMES: Grab a fresh clone of the scene graph
    const vacuumModel = assetLoader.clone("vacuum");
    if (!vacuumModel) {
      throw new Error("Vacuum model not found after loading.");
    }

    //JAMES: Create our Vacuum entity with the position & model
    const vacuum = new Vacuum({
      position:
        position instanceof THREE.Vector3 ? position : new THREE.Vector3(),
      model: vacuumModel,
    });

    //JAMES: Register it and expose globally for debugging
    entityManager.addEntity(vacuum);
    window.vacuum = vacuum;

    return vacuum;
  } catch (error) {
    console.error("Error loading vacuum model:", error);
    throw error;
  }
}
