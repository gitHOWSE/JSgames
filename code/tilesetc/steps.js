// code/tilesetc/steps.js
import * as THREE from "three";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";

export default class Steps extends Entity {
  /**
   * @param {Object} options
   * @param {THREE.Scene} options.scene — Scene to which the steps are added.
   * @param {number} [options.x=0] — World X position.
   * @param {number} [options.z=0] — World Z position.
   * @param {number} [options.story=0] — Building story.
   * @param {number} [options.yOffset=0] — Vertical offset for the entire mesh.
   */
  constructor({ scene, x = 0, z = 0, story = 0, yOffset = -18 } = {}) {
    // JAMES: Initialize base Entity.
    super({ scene });
    // JAMES: This tile is static.
    this.setMovable(false);
    // JAMES: Store magic Y offset.
    this.yOffset = yOffset;
    // JAMES: Create mesh group.
    this.model = new THREE.Group();
    scene.add(this.model);
    // JAMES: Clone steps mesh.
    const stepsMesh = assetLoader.clone("steps");
    this.model.add(stepsMesh);
    // JAMES: Apply ramp scaling.
    const scaleX = 8.5, scaleY = 7, scaleZ = 6;
    this.model.scale.set(scaleX, scaleY, scaleZ);
    // JAMES: Compute bounding box and size.
    const bbox = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    // JAMES: Base and story offsets plus magic yOffset.
    const baseY = -bbox.max.y - 0.5;
    const storyY = story * size.y + this.yOffset;
    this.model.position.set(x, baseY + storyY, z);
  }

  /**
   * JAMES: Per-frame update. Handles climbable logic.
   * @param {number} delta — Time since last update.
   */
  update(delta) {
    // JAMES: World-space bounding box.
    const worldBB = new THREE.Box3().setFromObject(this.model);
    // JAMES: Convert to local-space min/max.
    const minL = this.model.worldToLocal(worldBB.min.clone());
    const maxL = this.model.worldToLocal(worldBB.max.clone());
    const normMin = new THREE.Vector3(
      Math.min(minL.x, maxL.x),
      Math.min(minL.y, maxL.y),
      Math.min(minL.z, maxL.z)
    );
    const normMax = new THREE.Vector3(
      Math.max(minL.x, maxL.x),
      Math.max(minL.y, maxL.y),
      Math.max(minL.z, maxL.z)
    );
    const localBox = new THREE.Box3(normMin, normMax);

    // JAMES: Steps center in world XZ.
    const center = new THREE.Vector3(this.model.position.x, 0, this.model.position.z);
    const pushDist = 0.5;

    // JAMES: Check each entity.
    for (const entity of entityManager.getEntities()) {
      if (entity.id === this.id || !entity.getMovable()) continue;
      // JAMES: Local position on steps.
      const localPos = this.model.worldToLocal(entity.position.clone());
      if (
        localPos.x >= localBox.min.x && localPos.x <= localBox.max.x &&
        localPos.z >= localBox.min.z && localPos.z <= localBox.max.z
      ) {
        // JAMES: Compute interpolation factor t.
        const t = (localPos.z - localBox.min.z) / (localBox.max.z - localBox.min.z);
        // JAMES: Compute new world Y.
        const newLocalY = THREE.MathUtils.lerp(localBox.max.y * 8, localBox.min.y, t);
        const newWorldY = this.model.position.y + newLocalY;
        const currentY = entity.position.y;

        // JAMES: Ascending attempt.
        if (newWorldY > currentY && !entity.getLegs()) {
          // JAMES: Block non-legged ascent like a wall.
          const dir = new THREE.Vector3(
            entity.position.x - center.x,
            0,
            entity.position.z - center.z
          ).normalize();
          // JAMES: Reflect XZ velocity.
          entity.movement.velocity.x *= -1;
          entity.movement.velocity.z *= -1;
          // JAMES: Push entity away from steps center.
          entity.position.x += dir.x * pushDist;
          entity.position.z += dir.z * pushDist;
          continue;
        }
        // JAMES: Allow descent or legged ascent.
        entity.position.y = newWorldY;
      }
    }
  }

  // JAMES: Orientation helpers.
  setOrientationNorth() { this.model.rotation.y = 0; }
  setOrientationEast() { this.model.rotation.y = Math.PI / 2; }
  setOrientationSouth() { this.model.rotation.y = Math.PI; }
  setOrientationWest() { this.model.rotation.y = -Math.PI / 2; }
}
