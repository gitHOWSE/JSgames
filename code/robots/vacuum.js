// robots/vacuum.js
"use strict";

import * as THREE from "three";
import { Movement } from "../entities/Movement.js";
import { Item } from "../entities/Items.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { AdvancedAssetLoader } from "../Util/AdvancedAssetLoader.js";

//JAMES: Create a shared loader instance (you can configure Draco/KTX2 paths here)
const assetLoader = new AdvancedAssetLoader({
  dracoPath: "/draco/",   // adjust if you host Draco decoders elsewhere
  ktx2Path: "/basis/",    // adjust if you host Basis transcoder elsewhere
  onProgress: (name, p) => console.log(`[AssetLoader] ${name}: ${p}`),
  onError:    (name, err) => console.error(`[AssetLoader] ${name} failed`, err),
});

class Vacuum extends Entity {
  constructor(position, model) {
    const movement = new Movement("wheels", 10, 10);
    movement.setTurningAccelerationFactor(100.0);
    const item = new Item();
    super("vacuum", 100, 60, movement, item);

    this.is_player = true;

    //JAMES: Initialize position
    if (position) {
      this.position.copy(position);
    } else {
      this.position.set(0, 0, 0);
    }

    //JAMES: Clone the loaded model and set up shadows
    this.mesh = model.clone();
    this.mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.mesh.position.copy(this.position);

    //JAMES: Add any lights
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
    //JAMES: Load the vacuum model (only decodes once, then caches)
    await assetLoader.load(
      "vacuum",
      "/models/robots/Robotic_Vacuum_Charm_0404141555_texture.glb"
    );

    //JAMES: Clone a fresh instance of the scene graph
    const vacuumModel = assetLoader.clone("vacuum");
    if (!vacuumModel) {
      throw new Error("Vacuum model not found after loading.");
    }

    //JAMES: Create the entity, add it to the manager, and expose globally
    const vacuum = new Vacuum(position, vacuumModel);
    entityManager.addEntity(vacuum);
    window.vacuum = vacuum;
    return vacuum;
  } catch (error) {
    console.error("Error loading vacuum model:", error);
    throw error;
  }
}
