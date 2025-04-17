// robots/projectile.js
import * as THREE from "three";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";

export class Projectile extends Entity {
  /**
   * @param {Object} options 
   * @param {THREE.Scene} options.scene       — Scene to which this projectile is added
   * @param {THREE.Vector3} options.position  — Start position
   * @param {THREE.Vector3} options.direction — Unit direction vector
   * @param {number} [options.speed=50]       — Movement speed
   * @param {number} [options.lifetime=5]     — Seconds before auto‑destroy
   */
  constructor({ scene, position, direction, speed = 50, lifetime = 5 }) {
    // JAMES: Call base Entity so we get model/group and can add to scene.
    super({ scene });
    // JAMES: Must have a valid position and direction.
    if (!position || !direction) {
      throw new Error("Projectile requires position and direction");
    }
    // JAMES: Copy start position and direction.
    this.position.copy(position);
    this.direction = direction.clone().normalize();
    this.speed = speed;
    this.lifetime = lifetime;
    this.age = 0;

    // JAMES: Simple sphere mesh for the projectile.
    const geo = new THREE.SphereGeometry(0.2, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    this.mesh = new THREE.Mesh(geo, mat);
    this.model.add(this.mesh);

    // JAMES: Ensure bounding box exists for potential collisions.
    this.updateBoundingBox();
  }

  // JAMES: Move each frame, age out, then remove.
  update(delta) {
    // JAMES: Translate along direction.
    const travel = this.direction.clone().multiplyScalar(this.speed * delta);
    this.position.add(travel);
    this.model.position.copy(this.position);

    // JAMES: Age and remove when expired.
    this.age += delta;
    if (this.age >= this.lifetime) {
      // JAMES: Simply mark health zero so entityManager pruning can remove it.
      this.health = 0;
    }

    // JAMES: Refresh bounding box for any collision checks.
    this.updateBoundingBox();
  }
}
