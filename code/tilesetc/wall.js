// code/tilesetc/wall.js
import * as THREE from "three";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";

export default class Wall extends Entity {
  // JAMES: Keep track of all wall instances.
  static walls = [];

  /**
   * @param {Object} options
   * @param {THREE.Scene} options.scene     — Scene to which the wall is added.
   * @param {number} [options.x=0]          — World X position.
   * @param {number} [options.z=0]          — World Z position.
   * @param {number} [options.story=0]      — Vertical stacking level.
   */
  constructor({ scene, x = 0, z = 0, story = 0 } = {}) {
    // JAMES: Base entity initialization.
    super({ scene });
    this.setMovable(false);

    // JAMES: Create a group to hold the wall mesh.
    this.model = new THREE.Group();
    scene.add(this.model);

    // JAMES: Clone the wall mesh and add it.
    const wallMesh = assetLoader.clone("wall");
    this.model.add(wallMesh);

    // JAMES: Apply default scale values.
    const scaleXZ = 7.95,
      scaleY = 5;
    this.model.scale.set(scaleXZ, scaleY, scaleXZ);

    // JAMES: Compute and store the wall's bounding box once.
    this.boundingBox = new THREE.Box3().setFromObject(this.model);

    // JAMES: Determine size and compute vertical offsets.
    const size = new THREE.Vector3();
    this.boundingBox.getSize(size);
    const baseOffsetY = -this.boundingBox.min.y - 1;
    const storyOffsetY = story * size.y;
    this.model.position.set(x, baseOffsetY + storyOffsetY, z);

    // JAMES: Register this wall instance.
    Wall.walls.push(this);
  }

  /**
   * JAMES: Per-frame update for collision checking.
   *       Uses the precomputed bounding box instead of recalculating every frame.
   *       For any entity intersecting the wall, reflects its velocity and teleports it just outside the wall.
   * @param {number} delta – Time elapsed since the last update.
   */
  update(delta) {
    // JAMES: Use the stored static bounding box.
    const wallBB = this.boundingBox; // Already computed in constructor

    // JAMES: Create a shrunken bounding box for penetration testing.
    const epsilon = 0.1;
    const shrunkenWallBB = wallBB.clone().expandByScalar(-epsilon);

    // Temporary objects for collision math.
    const tempOverlap = new THREE.Box3();
    const entBB = new THREE.Box3();
    const overlapSize = new THREE.Vector3();
    const entCenter = new THREE.Vector3();
    const wallCenter = new THREE.Vector3();
    const normal = new THREE.Vector3();

    // JAMES: Loop through all moving entities.
    entityManager.getEntities().forEach((ent) => {
      if (!ent.getMovable()) return;

      // JAMES: Update the entity’s bounding box.
      ent.updateBoundingBox();
      entBB.copy(ent.boundingBox);

      // JAMES: If the entity intersects the wall’s bounding box.
      if (entBB.intersectsBox(wallBB)) {
        ent.setCollided && ent.setCollided(true);
        setTimeout(() => {
          ent.setCollided && ent.setCollided(false);
        }, 100);

        // JAMES: Compute the overlapping volume.
        tempOverlap.copy(entBB).intersect(wallBB);
        tempOverlap.getSize(overlapSize);

        // JAMES: Determine the axis with the smallest overlap.
        let axis = "x";
        if (overlapSize.y < overlapSize.x && overlapSize.y < overlapSize.z)
          axis = "y";
        else if (overlapSize.z < overlapSize.x && overlapSize.z < overlapSize.y)
          axis = "z";

        // JAMES: Get centers of both bounding boxes.
        entBB.getCenter(entCenter);
        wallBB.getCenter(wallCenter);
        normal.set(0, 0, 0);
        normal[axis] = entCenter[axis] > wallCenter[axis] ? 1 : -1;

        // JAMES: Reflect the entity's velocity about the collision normal.
        const v = ent.movement.velocity.clone();
        const dot = v.dot(normal);
        const reflected = v.clone().sub(normal.clone().multiplyScalar(2 * dot));
        ent.movement.velocity.copy(reflected);

        // JAMES: Check penetration using the shrunken bounding box.
        if (entBB.intersectsBox(shrunkenWallBB)) {
          // JAMES: Teleport the entity to just outside the wall along the collision axis.
          if (entCenter[axis] > wallCenter[axis]) {
            ent.position[axis] =
              wallBB.max[axis] +
              epsilon +
              (ent.position[axis] - entBB.max[axis]);
          } else {
            ent.position[axis] =
              wallBB.min[axis] -
              epsilon +
              (ent.position[axis] - entBB.min[axis]);
          }
          ent.model.position.copy(ent.position);
        } else {
          // JAMES: Otherwise, push the entity out by the overlap distance.
          const pushDist = overlapSize[axis];
          ent.model.position.add(normal.clone().multiplyScalar(pushDist));
          ent.position.copy(ent.model.position);
        }

        // JAMES: Update the entity's bounding box to prevent repeated collisions.
        ent.updateBoundingBox();
      }
    });
  }

  // JAMES: Rotation and orientation helper methods.
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

  // JAMES: Returns the wall’s dimensions.
  getDimensions() {
    const bbox = this.boundingBox;
    const size = new THREE.Vector3();
    bbox.getSize(size);
    return size;
  }
}
