// Util/raycast.js
// JAMES: Line‑of‑sight helper using Three.js Raycaster.
// JAMES: Returns true if nothing blocks the ray from `origin` to `target`.
// JAMES: If `obstacles` array is omitted, defaults to all “wall” entities.

import * as THREE from "three";
import entityManager from "../entities/EntityManager.js";

export function raycast(origin, target, obstacles = null) {
  // JAMES: Compute normalized direction and maximum distance.
  const direction = new THREE.Vector3().subVectors(target, origin).normalize();
  const maxDistance = origin.distanceTo(target);

  // JAMES: Create a Raycaster from origin toward target.
  const ray = new THREE.Raycaster(origin, direction, 0, maxDistance);

  // JAMES: Determine which objects to test.
  let candidates;
  if (Array.isArray(obstacles)) {
    // JAMES: Use provided obstacle meshes or object3Ds.
    candidates = obstacles;
  } else {
    // JAMES: Default to every wall entity’s model in the scene.
    candidates = entityManager
      .getEntities("wall")
      .map((wallEnt) => wallEnt.model);
  }

  // JAMES: Gather all mesh descendants under each candidate.
  const meshes = [];
  for (const obj of candidates) {
    obj.traverse((child) => {
      if (child.isMesh) meshes.push(child);
    });
  }

  // JAMES: Perform intersection test against all meshes.
  const hits = ray.intersectObjects(meshes, true);

  // JAMES: Clear line of sight if nothing was hit.
  return hits.length === 0;
}
