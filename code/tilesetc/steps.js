// code/tilesetc/ramp.js
// JAMES: This class defines a ramp that extends Entity.
// JAMES: The ramp uses its own geometry and a normalized local bounding box to determine its XZ footprint,
// JAMES: then adjusts the Y position of any movable entity that is inside the footprint based on its local Z position.
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
    // JAMES: Call the base Entity constructor.
    super({ scene });

    // JAMES: Make the ramp static (nonmovable).
    this.setMovable(false);

    // JAMES: Create the mesh group and add it to the scene.
    this.model = new THREE.Group();
    scene.add(this.model);

    // JAMES: Clone the ramp mesh from the asset loader.
    const rampMesh = assetLoader.clone("ramp");
    this.model.add(rampMesh);

    // JAMES: Apply default scaling (adjust these multipliers as needed).
    const scaleX = 8.5,
      scaleY = 7,
      scaleZ = 6;
    this.model.scale.set(scaleX, scaleY, scaleZ);

    // JAMES: Compute the world-space bounding box.
    this.boundingBox = new THREE.Box3().setFromObject(this.model);

    // JAMES: Determine the size of the ramp.
    const size = new THREE.Vector3();
    this.boundingBox.getSize(size);

    // JAMES: Compute base Y offset so the bottom aligns with y = 0.
    const baseOffsetY = -this.boundingBox.max.y - 0.5;
    const storyOffsetY = story * size.y;
    this.model.position.set(x, baseOffsetY + storyOffsetY, z);
  }

  /**
   * JAMES: Per-frame update.
   * Checks all movable entities; if an entity's world position (converted to local space)
   * is within the ramp's normalized XZ footprint, it adjusts the entity’s Y coordinate.
   * @param {number} delta – Time elapsed since last update.
   */
  update(delta) {
    // JAMES: Update the world bounding box.
    const worldBBox = new THREE.Box3().setFromObject(this.model);

    // JAMES: Convert world bbox to local space.
    const localMin = this.model.worldToLocal(worldBBox.min.clone());
    const localMax = this.model.worldToLocal(worldBBox.max.clone());

    // JAMES: Create a normalized local bbox (min <= max for all axes).
    const normMin = new THREE.Vector3(
      Math.min(localMin.x, localMax.x),
      Math.min(localMin.y, localMax.y),
      Math.min(localMin.z, localMax.z),
    );
    const normMax = new THREE.Vector3(
      Math.max(localMin.x, localMax.x),
      Math.max(localMin.y, localMax.y),
      Math.max(localMin.z, localMax.z),
    );
    const localBox = new THREE.Box3(normMin, normMax);

    // JAMES: Log the normalized local bounding box.
   // console.log(
     // `//JAMES: Normalized LocalBBox: min=(${localBox.min.x.toFixed(2)}, ${localBox.min.y.toFixed(2)}, ${localBox.min.z.toFixed(2)}), max=(${localBox.max.x.toFixed(2)}, ${localBox.max.y.toFixed(2)}, ${localBox.max.z.toFixed(2)})`,
 //   );

    // JAMES: Iterate over all entities from the manager.
    const entities = entityManager.getEntities();
    for (const entity of entities) {
      // Skip self or non-movable entities.
      if (entity.id === this.id || !entity.getMovable()) continue;

      // JAMES: Convert the entity's world position to the ramp’s local space.
      const localEntityPos = this.model.worldToLocal(entity.position.clone());
     // console.log(
       // `//JAMES: Entity ${entity.id} local pos: (${localEntityPos.x.toFixed(2)}, ${localEntityPos.y.toFixed(2)}, ${localEntityPos.z.toFixed(2)})`,
     // );

      // JAMES: Check if the entity is inside the ramp's XZ footprint.
      if (
        localEntityPos.x >= localBox.min.x &&
        localEntityPos.x <= localBox.max.x &&
        localEntityPos.z >= localBox.min.z &&
        localEntityPos.z <= localBox.max.z
      ) {
        console.log(
        `//JAMES: Entity ${entity.id} is within the ramp's footprint.`,
        );
        // JAMES: Compute interpolation factor along the local Z axis.
        const t =
          (localEntityPos.z - localBox.min.z) /
          (localBox.max.z - localBox.min.z);

        // JAMES: Calculate target local Y using linear interpolation.
        // Adjust the multipliers (e.g. *8) as needed to fit your model.
        const newLocalY = THREE.MathUtils.lerp(
          localBox.max.y * 8,
          localBox.min.y,
          t,
        );

        // JAMES: Compute the new world Y position.
        const newWorldY = this.model.position.y + newLocalY;

        // JAMES: Apply the Y adjustment.
        entity.position.y = newWorldY;
    
      } else {
       // console.log(`//JAMES: Entity ${entity.id} not within ramp footprint.`);
      }
    }
  }

  // JAMES: Orientation methods to set the ramp's facing direction.
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
