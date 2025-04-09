// robots/vacuum.js
"use strict";

import * as THREE from "three";
import { Movement } from "../entities/Movement.js";
import { Item } from "../entities/Items.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";

class Vacuum extends Entity {
  constructor(params = {}) {
    //JAMES: Ensure the params object has all the bits Entity needs
    params.name = "vacuum";
    params.health = 100;
    params.armor = 60;
    params.movement = new Movement("wheels", 10, 1);
    params.item = new Item();

    //JAMES: Turning and force.
    params.movement.turningAccelerationFactor = 100;

    //JAMES: Call the parent constructor with our params object
    super(params);

    //JAMES: Mark as the player entity
    this.is_player = true;

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
    this.mesh.position.copy(this.position);

    this.model.add(this.mesh);
    this.enableBulbLight?.();
    this.enableHeadlights?.();
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
