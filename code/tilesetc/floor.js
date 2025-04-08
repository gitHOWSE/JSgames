// JSgames/code/tilesetc/floor.js

//JAMES: Import Three.js and GLTFLoader for model loading.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

    //JAMES: Define the path to the floor model (adjusted for our folder structure).
    const modelPath = "../models/tilesetc/Tile.glb";

    //JAMES: Instantiate the GLTFLoader to load the glTF model.
    const loader = new GLTFLoader();

    //JAMES: Load the model from the specified path.
    loader.load(
      modelPath,
      (gltf) => {
        //JAMES: On successful load, add the (model) to the group.
        this.model.add(gltf.scene);

        //JAMES: Adjust the scale and position.
        const scaleXZ = 6;
        const scaleY = 5;
        this.model.scale.set(scaleXZ, scaleY, scaleXZ);
        const bbox = new THREE.Box3().setFromObject(this.model);
        this.model.position.set(0, -bbox.max.y - 0.45, 0);
      },
      (xhr) => {
        //JAMES: Log progress to the console.
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        //JAMES: Log any errors that occur during model loading.
        console.error(
          "An error occurred while loading the floor model:",
          error,
        );
      },
    );
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

  getDimensions() {
    const bbox = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    return size;
  }
}

export default Floor;
