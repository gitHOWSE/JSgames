//JAMES: Import necessary things for the camera controls.
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import config from "/json/general.json" assert { type: "json" };

class CameraManager {
  constructor() {
    //JAMES: Create a scene.
    this.scene = new THREE.Scene();

    //JAMES: Set up a renderer and make it the size of the user's window.
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    //JAMES: Create a perspective camera.
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    //JAMES: Disable manual controls.
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement,
    );
    this.orbitControls.enableZoom = false;
    this.orbitControls.enablePan = false;
    this.orbitControls.enableRotate = false;
  }

  //JAMES: Function to lock onto an object.
  followObject(object) {
    this.camera.position.set(
      object.position.x,
      object.position.y,
      object.position.z,
    );
    this.camera.lookAt(object.position);
  }

  //JAMES: Function to move the camera from one spot to another smoothly.
  transportCamera(target, cameraSpeedOverride, funcOnComplete) {
    const speed = cameraSpeedOverride || config.cameraSpeed;
    const startingPos = this.camera.position.clone();
    const targetPos = new THREE.Vector3(target.x, startingPos.y, target.z);
    let dist = startingPos.distanceTo(targetPos);
    let expectedDuration = dist / speed;
    const startTime = performance.now();

    function update() {
      const elapsed = performance.now() - startTime;
      let t = elapsed / expectedDuration;
      if (t > 1) t = 1;
      this.camera.position.lerpVectors(startingPos, targetPos, t);

      if (t < 1) {
        requestAnimationFrame(update.bind(this));
      } else if (typeof funcOnComplete === "function") {
        funcOnComplete();
      }
    }
    update.call(this);
  }
}

//JAMES: Export a singleton instance of CameraManager.
export const cameraManager = new CameraManager();
