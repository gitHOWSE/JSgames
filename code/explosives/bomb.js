// src/robots/bomb.js
import * as THREE from "three";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { cameraManager } from "../Util/Camera.js";
import entityManager from "../entities/EntityManager.js";
import { Entity } from "../entities/Entity.js";

// JAMES: Constants for explosion behavior
const EXPLOSION_RADIUS = 5;     // JAMES: units in world space
const EXPLOSION_DAMAGE = 50;    // JAMES: hp per entity
const CLOUD_LIFETIME_MS = 2000; // JAMES: how long the cloud stays

/**
 * JAMES: Cause an object or Entity to explode and be removed from the game.
 * @param {THREE.Object3D|Entity} target - The object or Entity to destroy.
 */
export async function dieGracefully(target) {
  // JAMES: Determine explosion origin in world coordinates
  const origin = new THREE.Vector3();
  if (target instanceof Entity) {
    target.getWorldPosition(origin);
  } else if (target instanceof THREE.Object3D) {
    target.getWorldPosition(origin);
  } else {
    console.warn("dieGracefully: unsupported target", target);
    return;
  }

  // JAMES: Load and spawn the static explosion cloud
  const cloud = await assetLoader.load("explosion");
  cloud.position.copy(origin);
  cameraManager.scene.add(cloud);

  // JAMES: Damage all entities within radius
  const tempVec = new THREE.Vector3();
  for (const e of entityManager.getEntities()) {
    e.getWorldPosition(tempVec);
    if (tempVec.distanceTo(origin) <= EXPLOSION_RADIUS) {
      e.takeDamage(EXPLOSION_DAMAGE);
    }
  }

  // JAMES: Remove the target from the game
  if (target instanceof Entity) {
    // JAMES: Remove model from scene
    if (target.model.parent) {
      target.model.parent.remove(target.model);
    }
    // JAMES: Mark dead so EntityManager will unregister it
    target.setHealth(0);
  } else {
    // JAMES: Not an Entity—remove directly
    if (target.parent) {
      target.parent.remove(target);
    }
  }

  // JAMES: Clean up explosion cloud after lifetime expires
  setTimeout(() => {
    cameraManager.scene.remove(cloud);
    assetLoader.unload("explosion");
  }, CLOUD_LIFETIME_MS);
}
