// code/tilesetc/ramp.js
//JAMES: This class defines a ramp that extends Entity.
//JAMES: The ramp uses its own geometry and local bounding box to determine its XZ footprint.
//JAMES: During each frame update, it checks all entities in the Entity Manager and, if an entity is
//JAMES: inside the ramp's XZ area, adjusts the entity's Y position based on its local Z coordinate on the ramp.
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
   * @param {number} [options.story=0]      — Building story (each integer adds one "floor" height).
   */
  constructor({ scene, x = 0, z = 0, story = 0 } = {}) {
    //JAMES: Call the base Entity constructor for standard initialization.
    super({ scene });

    //JAMES: Create a Group to hold the ramp mesh.
    this.model = new THREE.Group();
    scene.add(this.model);

    //JAMES: Clone the ramp mesh from the asset loader.
    const rampMesh = assetLoader.clone("ramp");
    this.model.add(rampMesh);

    const scaleX = 8.5,
      scaleY = 5,
      scaleZ = 6;
    this.model.scale.set(scaleX, scaleY, scaleZ);

    //JAMES: Compute the ramp's world-space bounding box.
    this.boundingBox = new THREE.Box3().setFromObject(this.model);

    //JAMES: Determine the size of the ramp from the bounding box.
    const size = new THREE.Vector3();
    this.boundingBox.getSize(size);

    //JAMES: Base Y offset to align the bottom of the mesh with y = 0.
    const baseOffsetY = -this.boundingBox.min.y;
    //JAMES: Story offset: each story is one bounding box height above the previous.
    const storyOffsetY = story * size.y;

    //JAMES: Position the ramp in world space.
    this.model.position.set(x, baseOffsetY + storyOffsetY, z);
  }

  /**
   * JAMES: Per‑frame update.
   *        Iterates over all entities (except itself) to check if they are within the ramp's XZ footprint.
   *        If so, calculates an interpolation factor along the ramp's local Z‑axis, determines a target local Y,
   *        and sets the entity’s world Y accordingly.
   * @param {number} delta – Time elapsed since the last update.
   */
  update(delta) {
    //JAMES: Recompute the ramp's world-space bounding box.
    const worldBBox = new THREE.Box3().setFromObject(this.model);

    //JAMES: Convert the world bounding box min and max into the ramp's local space.
    const localMin = this.model.worldToLocal(worldBBox.min.clone());
    const localMax = this.model.worldToLocal(worldBBox.max.clone());
    const localBox = new THREE.Box3(localMin, localMax);

    //JAMES: Get all entities.
    const entities = entityManager.getEntities();

    //JAMES: Iterate through each entity (skip self).
    for (const entity of entities) {
      if (entity.id === this.id) continue; // Skip self

      //JAMES: Convert the entity's world position into the ramp's local space.
      const localEntityPos = this.model.worldToLocal(entity.position.clone());

      //JAMES: Check if the entity's local X and Z are within the ramp's XZ footprint.
      if (
        localEntityPos.x >= localBox.min.x &&
        localEntityPos.x <= localBox.max.x &&
        localEntityPos.z >= localBox.min.z &&
        localEntityPos.z <= localBox.max.z
      ) {
        //JAMES: Compute an interpolation factor (t) along the ramp's local Z axis.
        const t =
          (localEntityPos.z - localBox.min.z) /
          (localBox.max.z - localBox.min.z);

        //JAMES: Calculate the target local Y using linear interpolation.
        //JAMES: Adjust these multipliers as needed to fit your ramp's geometry.
        const newLocalY = THREE.MathUtils.lerp(
          localBox.max.y * 8,
          localBox.min.y,
          t,
        );

        //JAMES: Calculate the new world Y position: ramp's world Y plus the target local Y.
        const newWorldY = this.model.position.y + newLocalY;

        //JAMES: Adjust the entity's Y position.
        entity.position.y = newWorldY;
      } else {
      }
    }
  }
}
