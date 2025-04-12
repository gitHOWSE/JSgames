// code/tilesetc/floor.js
import * as THREE from "three";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";

export default class Floor extends Entity {
  /**
   * @param {Object} options
   * @param {THREE.Scene} options.scene      — The scene to add the floor.
   * @param {number} [options.x=0]           — World X position.
   * @param {number} [options.z=0]           — World Z position.
   * @param {number} [options.story=0]       — Building story (each integer adds one floor height).
   */
  constructor({ scene, x = 0, z = 0, story = 0 } = {}) {
    //JAMES: Call Entity constructor for standard initialization.
    super({ scene });

    this.setMovable(false);
    //JAMES: Create a group to hold the floor mesh.
    this.model = new THREE.Group();
    scene.add(this.model);

    //JAMES: Clone the loaded tile mesh from the assetLoader.
    const tileMesh = assetLoader.clone("tile");
    this.model.add(tileMesh);

    //JAMES: Apply default scaling.
    const scaleXZ = 6,
      scaleY = 5;
    this.model.scale.set(scaleXZ, scaleY, scaleXZ);

    //JAMES: Compute the floor's bounding box and size.
    this.boundingBox = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    this.boundingBox.getSize(size);

    //JAMES: Compute the base offset so that the bottom of the mesh lines up with y = 0.
    const baseOffsetY = -this.boundingBox.min.y - 10.4;
    //JAMES: Compute a story offset (stacking floors vertically).
    const storyOffsetY = story * size.y;

    //JAMES: Position the floor in world space.
    this.model.position.set(x, baseOffsetY + storyOffsetY, z);
  }

  /**
   * JAMES: Update method that checks for collisions with moving entities.
   * @param {number} delta — Time elapsed since the last update.
   */
  update(delta) {
    //JAMES: Refresh the floor's bounding box according to its current transformation.
    this.boundingBox.setFromObject(this.model);

    //JAMES: Prepare temporary objects for collision calculations.
    const tempOverlap = new THREE.Box3();
    const entBB = new THREE.Box3();
    const overlapSize = new THREE.Vector3();
    const entCenter = new THREE.Vector3();
    const floorCenter = new THREE.Vector3();
    const normal = new THREE.Vector3();

    //JAMES: Iterate over all entities that might be moving.
    entityManager.getEntities().forEach((ent) => {
      //JAMES: Skip non-moving entities and avoid self-collision.
      if (!ent.getMovable() || ent.id === this.id) return;

      //JAMES: Update the entity's bounding box.
      ent.updateBoundingBox();
      entBB.copy(ent.boundingBox);

      //JAMES: Check for intersection between the entity and the floor.
      if (entBB.intersectsBox(this.boundingBox)) {
        //JAMES: Compute the overlapping region (penetration volume).
        tempOverlap.copy(entBB).intersect(this.boundingBox);
        tempOverlap.getSize(overlapSize);

        //JAMES: Determine the axis (x, y, or z) where the overlap is smallest.
        let axis = "x";
        if (overlapSize.y < overlapSize.x && overlapSize.y < overlapSize.z) {
          axis = "y";
        } else if (
          overlapSize.z < overlapSize.x &&
          overlapSize.z < overlapSize.y
        ) {
          axis = "z";
        }

        //JAMES: Calculate the centers of the entity's and floor's bounding boxes.
        entBB.getCenter(entCenter);
        this.boundingBox.getCenter(floorCenter);

        //JAMES: Set the collision normal on the smallest overlapping axis.
        normal.set(0, 0, 0);
        normal[axis] = entCenter[axis] > floorCenter[axis] ? 1 : -1;

        //JAMES: Reflect the entity's velocity about the normal.
        const v = ent.movement.velocity.clone();
        const dot = v.dot(normal);
        const reflected = v.sub(normal.clone().multiplyScalar(2 * dot));
        ent.movement.velocity.copy(reflected);

        //JAMES: Push the entity out of the floor along the chosen axis by the overlap distance plus a small buffer.
        const pushDist = overlapSize[axis] + 0.1;
        ent.model.position.add(normal.clone().multiplyScalar(pushDist));
        ent.position.copy(ent.model.position);

        //JAMES: Update the entity's bounding box to prevent re-collision.
        ent.updateBoundingBox();
      }
    });
  }

  //JAMES: Helper methods to rotate the floor by 90 degrees around each axis.
  rotateX90() {
    this.model.rotation.x += Math.PI / 2;
  }
  rotateY90() {
    this.model.rotation.y += Math.PI / 2;
  }
  rotateZ90() {
    this.model.rotation.z += Math.PI / 2;
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
  //JAMES: Returns the current world-space dimensions of the floor.
  getDimensions() {
    const bbox = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    return size;
  }
}
