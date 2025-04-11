// code/tilesetc/floor.js
//JAMES: Import Three.js and the singleton assetLoader for model loading.
import * as THREE from "three";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
//JAMES: Import the base Entity class to extend its functionality.
import { Entity } from "../entities/Entity.js";

export default class Floor extends Entity {
  /**
   * @param {Object} options
   * @param {THREE.Scene} options.scene
   * @param {number} [options.x=0]     — world X position
   * @param {number} [options.z=0]     — world Z position
   * @param {number} [options.story=0] — which “floor” story (vertical stack)
   */
  constructor({ scene, x = 0, z = 0, story = 0 } = {}) {
    //JAMES: Call Entity constructor for base initialization.
    super({ scene });

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

    //JAMES: Compute bounding box to determine model height.
    const bbox = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    //JAMES: Base offset to align bottom of mesh with y=0.
    const baseOffsetY = -bbox.min.y;
    //JAMES: Story offset to stack floors by their own height.
    const storyOffsetY = story * size.y;

    //JAMES: Position the floor in world space.
    this.model.position.set(x, baseOffsetY + storyOffsetY, z);
  }

  //JAMES: Static floor does not require per‑frame updates.
  update(delta) {}

  //JAMES: Rotate the floor 90° around the X-axis.
  rotateX90() {
    this.model.rotation.x += Math.PI / 2;
  }

  //JAMES: Rotate the floor 90° around the Y-axis.
  rotateY90() {
    this.model.rotation.y += Math.PI / 2;
  }

  //JAMES: Rotate the floor 90° around the Z-axis.
  rotateZ90() {
    this.model.rotation.z += Math.PI / 2;
  }

  //JAMES: Returns the world-space dimensions of the floor model.
  getDimensions() {
    const bbox = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    return size;
  }
}
