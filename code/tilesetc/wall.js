// code/tilesetc/wall.js
import * as THREE from "three";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";

export default class Wall extends Entity {
  //JAMES: Keep track of all wall instances for easy collision loops.
  static walls = [];

  /**
   * @param {Object} options
   * @param {THREE.Scene} options.scene
   * @param {number} [options.x=0]     — world X position
   * @param {number} [options.z=0]     — world Z position
   * @param {number} [options.story=0] — which “floor” story (vertical stack)
   */
  constructor({ scene, x = 0, z = 0, story = 0 } = {}) {
    //JAMES: Base Entity initialization (sets up ID, tag, boundingBox, etc.)
    super({ scene });

    this.setMovable(false);
    //JAMES: Create a group to hold the wall mesh and add it to the scene.
    this.model = new THREE.Group();
    scene.add(this.model);
    //JAMES: Clone the wall mesh from the loader and add it.
    const wallMesh = assetLoader.clone("wall");
    this.model.add(wallMesh);

    //JAMES: Apply the same default scale as Floor.
    const scaleXZ = 7.95,
      scaleY = 5;
    this.model.scale.set(scaleXZ, scaleY, scaleXZ);

    //JAMES: Compute an initial bounding box for positioning & collisions.
    this.boundingBox = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    this.boundingBox.getSize(size);

    //JAMES: Compute vertical offsets: base aligns bottom at y=0; story stacks by height.
    const baseOffsetY = -this.boundingBox.min.y - 1;
    const storyOffsetY = story * size.y;

    //JAMES: Position the wall in world space.
    this.model.position.set(x, baseOffsetY + storyOffsetY, z);

    //JAMES: Register this wall for per-frame collision checks.
    Wall.walls.push(this);
  }

  /**
   * Per-frame update: refresh bounding box and bounce any intersecting entities.
   */
  update(delta) {
    //JAMES: Update this wall's bounding box to match its current world transform.
    this.boundingBox.setFromObject(this.model);

    //JAMES: Temporary objects for collision math.
    const tempOverlap = new THREE.Box3();
    const entBB = new THREE.Box3();
    const overlapSize = new THREE.Vector3();
    const entCenter = new THREE.Vector3();
    const wallCenter = new THREE.Vector3();
    const normal = new THREE.Vector3();

    //JAMES: Loop over all entities with movement (i.e. potential movers).
    entityManager.getEntities().forEach((ent) => {
      if (!ent.getMovable()) return;

      //JAMES: Refresh the entity's bounding box.
      ent.updateBoundingBox();
      entBB.copy(ent.boundingBox);

      //JAMES: If the entity intersects this wall...
      if (entBB.intersectsBox(this.boundingBox)) {
        //JAMES: Compute the overlapping volume.
        tempOverlap.copy(entBB).intersect(this.boundingBox);
        tempOverlap.getSize(overlapSize);

        //JAMES: Determine which axis has the smallest overlap.
        let axis = "x";
        if (overlapSize.y < overlapSize.x && overlapSize.y < overlapSize.z)
          axis = "y";
        else if (overlapSize.z < overlapSize.x && overlapSize.z < overlapSize.y)
          axis = "z";

        //JAMES: Compute collision normal sign by comparing centers.
        entBB.getCenter(entCenter);
        this.boundingBox.getCenter(wallCenter);
        normal.set(0, 0, 0);
        normal[axis] = entCenter[axis] > wallCenter[axis] ? 1 : -1;

        //JAMES: Reflect the entity's velocity vector about that normal.
        const v = ent.movement.velocity.clone();
        const dot = v.dot(normal);
        const reflected = v.clone().sub(normal.clone().multiplyScalar(2 * dot));
        ent.movement.velocity.copy(reflected);

        //JAMES: Push the entity out of the wall by the overlap distance.
        const pushDist = overlapSize[axis];
        ent.model.position.add(normal.clone().multiplyScalar(pushDist));
        ent.position.copy(ent.model.position);

        ent.updateBoundingBox();
      }
    });
  }

  //JAMES: Rotation helpers:
  rotateX90() {
    this.model.rotation.x += Math.PI / 2;
  }
  rotateY90() {
    this.model.rotation.y += Math.PI / 2;
  }
  rotateZ90() {
    this.model.rotation.z += Math.PI / 2;
  }

  //JAMES: Returns world‑space dimensions of the wall model.
  getDimensions() {
    const bbox = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    return size;
  }
}
