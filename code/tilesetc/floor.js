// JSgames/code/tilesetc/floor.js

//JAMES: Import Three.js and the singleton assetLoader for model loading.
import * as THREE from "three";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";

//JAMES: Import the base Entity class to extend its functionality.
import { Entity } from "../entities/Entity.js";

class Floor extends Entity {
  constructor(params = {}) {
    //JAMES: Call the parent constructor to ensure base initialization.
    super(params);

    //JAMES: Create a group to hold the floor model for easy transformations.
    this.model = new THREE.Group();

    //JAMES: Add the floor group to the scene if one is provided in parameters.
    if (params.scene) {
      params.scene.add(this.model);
    }

    //JAMES: Clone the already-loaded tile mesh from the singleton assetLoader.
    try {
      const tileScene = assetLoader.clone("tile");
      this.model.add(tileScene);

      //JAMES: Adjust the scale and position.
      const scaleXZ = 6;
      const scaleY = 5;
      this.model.scale.set(scaleXZ, scaleY, scaleXZ);

      //JAMES: Compute bounding box to align the tile with the ground.
      const bbox = new THREE.Box3().setFromObject(this.model);
      this.model.position.set(0, -bbox.max.y, 0);
    } catch (err) {
      console.error(
        "Floor tile not loaded yet. Ensure assetLoader.loadAll() is called before creating Floor.",
        err,
      );
    }
  }

  //JAMES: Override update for static entities; no per-frame updates are necessary.
  update(delta) {
    // Static floor does not require dynamic updates.
  }

  //JAMES: Method to rotate the floor 90° around the X-axis.
  rotateX90() {
    this.model.rotation.x += Math.PI / 2;
  }

  //JAMES: Method to rotate the floor 90° around the Y-axis.
  rotateY90() {
    this.model.rotation.y += Math.PI / 2;
  }

  //JAMES: Method to rotate the floor 90° around the Z-axis.
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

export default Floor;
