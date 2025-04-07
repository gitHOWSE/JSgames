// robots/vacuum.js
"use strict";

import * as THREE from "three";
import { Movement } from "../entities/Movement.js";
import { Item } from "../entities/Items.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { Resources } from "../Util/Resources.js";

const resourceFiles = [
  {
    name: "vacuum",
    url: "models/robots/Robotic_Vacuum_Charm_0404141555_texture.glb",
  },
];
const resources = new Resources(resourceFiles);

class Vacuum extends Entity {
  constructor(position, model) {
    const movement = new Movement("wheels", 10, 10);
    movement.setTurningAccelerationFactor(10.0);
    const item = new Item();
    super("vacuum", 100, 60, movement, item);

    // Mark this vacuum as player-controlled if desired.
    this.is_player = true;

    if (position) {
      this.position.copy(position);
    } else {
      this.position = new THREE.Vector3(0, 0, 0);
    }

    // Use the loaded model as the vacuum's mesh.
    this.mesh = model.clone();
    this.mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.mesh.position.copy(this.position);

    // Enable headlights.
    this.enableHeadlights();
  }
}

export async function createVacuum(position) {
  try {
    await resources.loadAll();
    const vacuumModel = resources.get("vacuum");
    if (!vacuumModel) {
      throw new Error("Vacuum model not found in resources.");
    }
    const vacuum = new Vacuum(position, vacuumModel);
    entityManager.addEntity(vacuum);
    window.vacuum = vacuum;
    return vacuum;
  } catch (error) {
    console.error("Error loading vacuum model:", error);
  }
}
