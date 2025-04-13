// code/tilesetc/ramp.js
// JAMES: This class defines a ramp that extends Entity.
// JAMES: The ramp uses its own geometry and local bounding box to determine its XZ footprint.
import * as THREE from "three";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";

export default class Ramp extends Entity {
  /**
   * @param {Object} options
   * @param {THREE.Scene} options.scene      Scene to which the ramp is added.
   * @param {number} [options.x=0]           World X position.
   * @param {number} [options.z=0]           World Z position.
   * @param {number} [options.story=0]       Building story.
   */
  constructor({ scene, x = 0, z = 0, story = 0 } = {}) {
    // JAMES: Call the base Entity constructor for standard initialization.
    super({ scene });

    this.setMovable(false);
    // JAMES: Create a Group to hold the ramp mesh.
    this.model = new THREE.Group();
    scene.add(this.model);

    // JAMES: Clone the ramp mesh from the asset loader and add it to the group.
    const rampMesh = assetLoader.clone("ramp");
    this.model.add(rampMesh);

    // JAMES: Apply default scaling (tweak these as needed).
    const scaleX = 8.5,
      scaleY = 7,
      scaleZ = 6;
    this.model.scale.set(scaleX, scaleY, scaleZ);

    // JAMES: Compute the ramp's world-space bounding box.
    this.boundingBox = new THREE.Box3().setFromObject(this.model);

    // JAMES: Determine the size of the ramp from the bounding box.
    const size = new THREE.Vector3();
    this.boundingBox.getSize(size);

    // JAMES: Compute a base Y offset so the bottom of the ramp aligns with y = 0.
    const baseOffsetY = -this.boundingBox.max.y - 0.5;
    // JAMES: Compute a story offset (each story is one bounding box height above the previous).
    const storyOffsetY = story * size.y;

    // JAMES: Position the ramp in world space.
    this.model.position.set(x, baseOffsetY + storyOffsetY, z);
  }

  /**
   * JAMES: Per‑frame update.
   * @param {number} delta – Time elapsed since the last update.
   */
  update(delta) {
    // JAMES: Recompute the ramp's world-space bounding box.
    const worldBBox = new THREE.Box3().setFromObject(this.model);

    // JAMES: Convert the world bounding box min and max into the ramp's local space.
    const localMin = this.model.worldToLocal(worldBBox.min.clone());
    const localMax = this.model.worldToLocal(worldBBox.max.clone());

    // JAMES: Create a normalized bounding box so that for each axis min <= max.
    const normalizedMin = new THREE.Vector3(
      Math.min(localMin.x, localMax.x),
      Math.min(localMin.y, localMax.y),
      Math.min(localMin.z, localMax.z),
    );
    const normalizedMax = new THREE.Vector3(
      Math.max(localMin.x, localMax.x),
      Math.max(localMin.y, localMax.y),
      Math.max(localMin.z, localMax.z),
    );
    const normalizedBox = new THREE.Box3(normalizedMin, normalizedMax);

    // JAMES: Debug: Log normalized bounding box.
    console.log(
      `//JAMES: Normalized LocalBBox: min=(${normalizedBox.min.x.toFixed(2)}, ${normalizedBox.min.y.toFixed(2)}, ${normalizedBox.min.z.toFixed(2)}), max=(${normalizedBox.max.x.toFixed(2)}, ${normalizedBox.max.y.toFixed(2)}, ${normalizedBox.max.z.toFixed(2)})`,
    );

    // JAMES: Get all entities from the EntityManager.
    const entities = entityManager.getEntities();

    // JAMES: Iterate through each entity (skipping self and non‑movable ones).
    for (const entity of entities) {
      if (entity.id === this.id) continue;
      if (!entity.getMovable()) continue;

      // JAMES: Convert the entity's world position to the ramp's local space.
      const localEntityPos = this.model.worldToLocal(entity.position.clone());

      // JAMES: Check if the entity is within the ramp's XZ footprint.
      if (
        localEntityPos.x >= normalizedBox.min.x &&
        localEntityPos.x <= normalizedBox.max.x &&
        localEntityPos.z >= normalizedBox.min.z &&
        localEntityPos.z <= normalizedBox.max.z
      ) {
        // JAMES: Compute interpolation factor (t) along the ramp's local Z axis.
        const t =
          (localEntityPos.z - normalizedBox.min.z) /
          (normalizedBox.max.z - normalizedBox.min.z);

        // JAMES: Calculate the target local Y using linear interpolation.
        const newLocalY = THREE.MathUtils.lerp(
          normalizedBox.max.y * 8,
          normalizedBox.min.y,
          t,
        );

        // JAMES: Compute the new world Y position: ramp's world Y plus the target local Y.
        const newWorldY = this.model.position.y + newLocalY;

        // JAMES: Adjust the entity's Y position.
        entity.position.y = newWorldY;
        console.log(
          `//JAMES: Entity ${entity.id} on ramp: t=${t.toFixed(2)}, newLocalY=${newLocalY.toFixed(2)}, worldY=${newWorldY.toFixed(2)}`,
        );
      } else {
      }
    }
  }

  setOrientationNorth() {
    this.model.rotation.y = 0;
  }
  setOrientationEast() {
    this.model.rotation.y = Math.PI / 2;
  }
  setOrientationSouth() {
    this.model.rotation.y = Math.PI;
  }
  setOrientationWest() {
    this.model.rotation.y = -Math.PI / 2;
  }
}
