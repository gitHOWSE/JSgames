// code/tilesetc/ramp.js
// JAMES: This class defines a ramp that extends Entity.
// JAMES: The ramp uses its own geometry and local bounding box to determine its XZ footprint.
// JAMES: During each frame update, it checks all entities in the Entity Manager and, if an entity is
// JAMES: inside the ramp’s XZ area, adjusts the entity’s Y position based on its progress along the ramp’s local Z-axis.
// JAMES: The ramp’s local Z-axis is assumed to be the direction of the slope. By using the worldToLocal()
// JAMES: conversion, we make it possible to rotate the ramp and still have correct behavior. To help with that,
// JAMES: we add methods to set the ramp’s orientation to North, East, South, or West.
import * as THREE from "three";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";

export default class Ramp extends Entity {
  /**
   * @param {Object} options
   * @param {THREE.Scene} options.scene     — Scene to which the ramp is added.
   * @param {number} [options.x=0]          — World X position.
   * @param {number} [options.z=0]          — World Z position.
   * @param {number} [options.story=0]      — Building story.
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

    // JAMES: Apply default scaling to adjust the size of the ramp (tweak these values as needed).
    const scaleX = 8.5,
      scaleY = 7,
      scaleZ = 6;
    this.model.scale.set(scaleX, scaleY, scaleZ);

    // JAMES: Compute the ramp's world-space bounding box.
    this.boundingBox = new THREE.Box3().setFromObject(this.model);

    // JAMES: Determine the size of the ramp from the bounding box.
    const size = new THREE.Vector3();
    this.boundingBox.getSize(size);

    // JAMES: Compute a base Y offset so the bottom of the ramp aligns with y=0.
    const baseOffsetY = -this.boundingBox.max.y - 0.5;
    // JAMES: Compute a story offset: each story is one bounding box height above the previous.
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
    const localBox = new THREE.Box3(localMin, localMax);

    // JAMES: Get all entities.
    const entities = entityManager.getEntities();

    // JAMES: Iterate through each entity (skip self).
    for (const entity of entities) {
      if (entity.id === this.id) continue;

      if (!entity.getMovable()) continue;
      // JAMES: Convert the entity's world position into the ramp's local space.
      const localEntityPos = this.model.worldToLocal(entity.position.clone());

      // JAMES: Check if the entity is inside the ramp's XZ footprint.
      if (
        localEntityPos.x >= localBox.min.x &&
        localEntityPos.x <= localBox.max.x &&
        localEntityPos.z >= localBox.min.z &&
        localEntityPos.z <= localBox.max.z
      ) {
        // JAMES: Compute interpolation factor (t) along the ramp's local Z axis.
        const t =
          (localEntityPos.z - localBox.min.z) /
          (localBox.max.z - localBox.min.z);

        // JAMES: Calculate the target local Y using linear interpolation.
        const newLocalY = THREE.MathUtils.lerp(
          localBox.max.y * 8,
          localBox.min.y,
          t,
        );

        // JAMES: Calculate the new world Y position: ramp's world Y plus the target local Y.
        const newWorldY = this.model.position.y + newLocalY;
        // JAMES: Apply the calculated Y position to the entity.
        entity.position.y = newWorldY;

        console.log(
          `//JAMES: Entity ${entity.id} on ramp: t=${t.toFixed(
            2,
          )}, newLocalY=${newLocalY.toFixed(2)}, worldY=${newWorldY.toFixed(2)}`,
        );
      }
    }
  }

  // JAMES: The following methods allow you to set the ramp's orientation to the four cardinal directions.
  //       These methods set the ramp model’s rotation so that its local Z-axis (slope direction) faces the desired direction.
  setOrientationNorth() {
    // JAMES: North: ramp slope will align with world negative Z.
    this.model.rotation.y = 0;
  }
  setOrientationEast() {
    // JAMES: East: ramp slope will align with world positive X.
    this.model.rotation.y = Math.PI / 2;
  }
  setOrientationSouth() {
    // JAMES: South: ramp slope will align with world positive Z.
    this.model.rotation.y = Math.PI;
  }
  setOrientationWest() {
    // JAMES: West: ramp slope will align with world negative X.
    this.model.rotation.y = -Math.PI / 2;
  }
}
