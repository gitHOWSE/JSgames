import * as THREE from "three";
import entityManager from "../entities/EntityManager.js";

/**
 * JAMES: Line‑of‑sight helper using Three.js Raycaster.
 * Returns true if nothing blocks the ray from `origin` to `target`.
 * If `obstacles` array is omitted, defaults to all “wall” entities.
 */// JAMES: LOS raycast — ignores origin and target entities.
export function raycast(origin, target, obstacles = null, exclude = []) {
  const direction = new THREE.Vector3().subVectors(target, origin).normalize(); // JAMES: Unit direction vector.
  const maxDistance = origin.distanceTo(target);                                // JAMES: Ray range.
  const ray = new THREE.Raycaster(origin, direction, 0, maxDistance);           // JAMES: New ray.

  // JAMES: By default, collect all models from entities except excluded ones.
  const candidates = Array.isArray(obstacles)
    ? obstacles
    : entityManager.getEntities()
        .filter(e => !exclude.includes(e))                                      // JAMES: Skip excluded.
        .map(e => e.model)
        .filter(Boolean);

  const meshes = [];
  for (const obj of candidates) {
    obj.traverse(child => {
      if (child.isMesh) meshes.push(child);                                     // JAMES: Meshes only.
    });
  }

  const hits = ray.intersectObjects(meshes, true);                              // JAMES: Actual test.

  return hits.length === 0;                                                     // JAMES: True if no hit.
}


/**
 * JAMES: Cone‑of‑vision helper.
 * Returns true if `target` is within the field of view from `origin` facing `forwardDir`,
 * and there is clear line of sight (no obstacles).
 * @param {Vector3} origin - start point
 * @param {Vector3} forwardDir - normalized facing direction
 * @param {Vector3} target - point to test
 * @param {number} fovDeg - half-angle of the cone in degrees (e.g., 45)
 * @param {Array<Object3D|Mesh>} obstacles - optional obstacle array
 */
export function inSightCone(origin, forwardDir, target, fovDeg = 45, obstacles = null, exclude = []) {
  const toTarget = new THREE.Vector3().subVectors(target, origin);
  const distance = toTarget.length();
  if (distance === 0) return true;

  const angleRad = toTarget.normalize().angleTo(forwardDir);
  if (angleRad > THREE.MathUtils.degToRad(fovDeg)) return false;

  return raycast(origin, target, obstacles, exclude); // JAMES: Now passes exclude list
}


/**
 * Scan for the nearest entity within a vision cone that you can actually see.
 *
 * @param {THREE.Vector3} origin      – world‑space ray origin
 * @param {THREE.Vector3} forwardDir  – normalized facing direction
 * @param {number}       fovDeg       – half-angle of the cone in degrees
 * @param {Function}     filterFn     – optional filter predicate: entity ⇒ boolean
 * @param {Array<Object3D>} obstacles – optional scene obstacles
 * @returns {Entity|null}             – the closest visible entity, or null
 */
export function findVisibleTarget(
  origin,
  forwardDir,
  fovDeg = 45,
  filterFn = e => e.is_robot,
  obstacles = null
) {
  let closest = null;
  let bestDist = Infinity;
  const scratch = new THREE.Vector3();

  for (const e of entityManager.getEntities()) {
    if (!filterFn(e)) continue;
    const pos = e.getWorldPosition(scratch);

    if (!inSightCone(origin, forwardDir, pos, fovDeg, obstacles)) continue;

    const d = origin.distanceTo(pos);
    if (d < bestDist) {
      bestDist = d;
      closest  = e;
    }
  }

  return closest;
}
