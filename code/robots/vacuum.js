
// vacuum.js
"use strict";

import * as THREE from "three";

//JAMES: Import the Movement module.
import { Movement } from "../entities/Movement.js";

//JAMES: Import the Item module.
import { Item } from "../entities/Items.js";

//JAMES: Import the base Entity module.
import { Entity } from "../entities/Entity.js";

//JAMES: Import the entity manager.
import entityManager from "../entities/EntityManager.js";

class Vacuum extends Entity {
  constructor(position) {
    //JAMES: Create a Movement object in "wheels" mode, with top speed 10 and max force 10.
    const movement = new Movement("wheels", 10, 10);
    //JAMES: Create an Item instance.
    const item = new Item();

    //JAMES: Call the parent Entity constructor with:
    //         tag "vacuum", max health 100, max charge 60, and the movement and item.
    super("vacuum", 100, 60, movement, item);

    //JAMES: If an initial position is provided, copy it; otherwise default to (0, 0, 0).
    if (position) {
      this.position.copy(position);
    } else {
      this.position = new THREE.Vector3(0, 0, 0);
    }

    //JAMES: Create a cylinder geometry and a standard material to visually represent the vacuum.
    const geometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
    this.mesh = new THREE.Mesh(geometry, material);

    //JAMES: Enable the mesh to cast and receive shadows.
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    //JAMES: Set the mesh's initial position to match the entity's position.
    this.mesh.position.copy(this.position);
  }

  //JAMES: The update method is called every frame with delta time.
  update(delta) {
    //JAMES: Define the forward vector (pointing down the negative Z-axis).
    const forward = new THREE.Vector3(0, 0, -1);

    //JAMES: Apply a slight random rotation around the Y-axis to simulate a wandering behavior.
    const randomAngle = (Math.random() - 0.5) * 0.1;
    forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), randomAngle);

    //JAMES: Compute acceleration in the forward direction.
    const acceleration = forward.multiplyScalar(0.2);
    this.movement.acceleration.add(acceleration);

    //JAMES: Update the velocity based on acceleration and delta time.
    this.movement.velocity.add(this.movement.acceleration.clone().multiplyScalar(delta));

    //JAMES: If velocity exceeds the top speed, clamp it.
    if (this.movement.velocity.length() > this.movement.topSpeed) {
      this.movement.velocity.setLength(this.movement.topSpeed);
    }

    //JAMES: Update the position based on the velocity.
    this.position.add(this.movement.velocity.clone().multiplyScalar(delta));

    //JAMES: Reset acceleration for the next update cycle.
    this.movement.acceleration.set(0, 0, 0);

    //JAMES: Sync the mesh's position with the entity's updated position.
    this.mesh.position.copy(this.position);
  }
}

//JAMES: Export a function to create and register a vacuum entity.
export function createVacuum(position) {
  const vacuum = new Vacuum(position);

  //JAMES: Register the vacuum instance with the entity manager.
  entityManager.addEntity(vacuum);

  //JAMES: Return the vacuum so it can be further manipulated elsewhere.
  return vacuum;
}
