// robots/forklift.js
"use strict";

import * as THREE from "three";
import { Movement } from "../entities/Movement.js";
import { Item } from "../entities/Items.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";

class Forklift extends Entity {
  constructor(params = {}) {
    //JAMES: Set up properties.
    params.name = "forklift";
    params.health = 150;
    params.armor = 90;
    params.movement = new Movement("wheels", 8, 1); // Slightly slower than vacuum.
    params.item = new Item();
    params.movement.turningAccelerationFactor = 40;

    //JAMES: This ensures that the parent's constructor creates a fresh Group.
    delete params.model;

    //JAMES: Call the Entity constructor.
    super(params);

    this.is_player = false;
    this.is_robot = true;
    this.is_hackable = true;

    if (params.position instanceof THREE.Vector3) {
      this.position.copy(params.position);
    } else {
      this.position.set(0, 0, 0);
    }

    if (this.mesh) {
      this.mesh.position.copy(this.position);
    }
  }
}

/**
 * createForklift
 * —————————
 * Loads the forklift asset (if not already loaded), instantiates a Forklift entity,
 * and registers it with the EntityManager.
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

    //JAMES: Create a Forklift entity using the asset as 'mesh'.
    const forklift = new Forklift({
      position:
        position instanceof THREE.Vector3 ? position : new THREE.Vector3(),
      mesh: forkliftModel, // JAMES: Pass the loaded asset as the mesh.
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
