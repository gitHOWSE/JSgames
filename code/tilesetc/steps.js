// code/tilesetc/steps.js
//JAMES: This class defines a steps object that extends Entity.
//JAMES: The steps use their own geometry and local bounding box to determine their XZ footprint.
//JAMES: When an entity is within that footprint, the steps adjust the entity’s Y position
//JAMES: based on its local Z-axis position on the steps. For entities without legs,
//JAMES: only downward (descent) adjustment is allowed.
import * as THREE from "three";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";

export default class Steps extends Entity {
  /**
   * @param {Object} options
   * @param {THREE.Scene} options.scene   — Scene to which the steps are added.
   * @param {number} [options.x=0]        — World X position.
   * @param {number} [options.z=0]        — World Z position.
   * @param {number} [options.story=0]    — Building story (each integer adds one "floor" height).
   */
  constructor({ scene, x = 0, z = 0, story = 0 } = {}) {
    //JAMES: Call the base Entity constructor for standard initialization.
    super({ scene });

    //JAMES: Create a group to hold the steps mesh.
    this.model = new THREE.Group();
    scene.add(this.model);

    //JAMES: Clone the preloaded steps mesh from the assetLoader.
    const stepsMesh = assetLoader.clone("steps");
    this.model.add(stepsMesh);

    //JAMES: Apply default scaling for steps.
    const scaleX = 6,
      scaleY = 5,
      scaleZ = 6;
    this.model.scale.set(scaleX, scaleY, scaleZ);

    //JAMES: Compute the world-space bounding box for the steps.
    this.boundingBox = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    this.boundingBox.getSize(size);

    //JAMES: Compute the base Y offset to align the bottom of the model with y = 0,
    //JAMES: subtracting an extra 4 units to ignore a base portion if needed.
    const baseOffsetY = -this.boundingBox.min.y - 4;
    //JAMES: Compute the story offset to stack steps vertically.
    const storyOffsetY = story * size.y;

    //JAMES: Position the steps in world space.
    this.model.position.set(x, baseOffsetY + storyOffsetY, z);
  }

  /**
   * JAMES: Per‑frame update.
   *        Iterates over all entities and, if an entity's XZ position (transformed to local space)
   *        is within the steps' footprint, adjusts its Y position based on its position along the local Z.
   *        Entities without legs are only allowed to descend.
   * @param {number} delta — Time elapsed since the last update.
   */
  update(delta) {
    //JAMES: Recompute the steps' world-space bounding box.
    const worldBBox = new THREE.Box3().setFromObject(this.model);
    //JAMES: Convert the world bounding box min and max into the steps' local space.
    const localMin = this.model.worldToLocal(worldBBox.min.clone());
    const localMax = this.model.worldToLocal(worldBBox.max.clone());
    const localBox = new THREE.Box3(localMin, localMax);

    //JAMES: Get all entities from the EntityManager.
    const entities = entityManager.getEntities();
    for (const entity of entities) {
      //JAMES: Skip the steps entity itself.
      if (entity.id === this.id) continue;

      //JAMES: Convert the entity's world position to the steps' local coordinate system.
      const localEntityPos = this.model.worldToLocal(entity.position.clone());

      //JAMES: Check if the entity is within the XZ footprint of the steps.
      if (
        localEntityPos.x >= localBox.min.x &&
        localEntityPos.x <= localBox.max.x &&
        localEntityPos.z >= localBox.min.z &&
        localEntityPos.z <= localBox.max.z
      ) {
        //JAMES: Compute interpolation factor t along the local Z-axis.
        const t =
          (localEntityPos.z - localBox.min.z) /
          (localBox.max.z - localBox.min.z);

        //JAMES: Determine target local Y via linear interpolation.
        //JAMES: Swap the min and max values if the ramp's orientation is inverted.
        const targetLocalY = THREE.MathUtils.lerp(
          localBox.max.y,
          localBox.min.y,
          t,
        );

        //JAMES: Calculate the new world Y position as the sum of the steps' world Y and the target local Y.
        const newWorldY = this.model.position.y + targetLocalY + 4;

        //JAMES: If the entity does not have legs (entity.hasLegs === false), only allow downward movement.
        if (!entity.getLegs()) {
          if (newWorldY < entity.position.y) {
            entity.position.y = newWorldY;
          } else {
          }
        } else {
          //JAMES: For entities with legs, allow full adjustment.
          entity.position.y = newWorldY;
        }
      } else {
      }
    }
  }
}
