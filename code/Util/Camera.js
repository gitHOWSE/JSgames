//JAMES: Import necessary things for the camera controls.
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import config from "/json/general.json" assert { type: "json" };

export const scene = new THREE.Scene();

//JAMES: Set up a renderer and make it the size of the user's window. Also deploy a perspective camera.
export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

//JAMES: Disable manual controls.
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = false;

//JAMES: Function to lock onto an object.
export function followObject(object, camera) {
  if (!camera) {
    camera = this.camera;
  }
  function update() {
    camera.position.set(
      object.position.x,
      object.position.y,
      object.position.z,
    );
    cam.lookAt(object.position);
  }
  update();
}

//JAMES: Function to move the camera from one spot to another smoothly.
export function transportCamera(
  target,
  camera,
  cameraSpeedOverride,
  funcOnComplete,
) {
  //JAMES: Target is only mandatory, so use this.camera if not specified.
  if (!camera) {
    camera = this.camera;
  }
  if (!cameraSpeedOverride) {
    speed = config.cameraSpeed;
  }
  const startingPos = camera.position.clone();
  const targetPos = new THREE.Vector3(target.x, startingPos.y, target.z);
  let dist = startingPos.distanceTo(targetPos);
  let expectedDuration = dist / speed;
  const startTime = performance.now();

  //JAMES: Inner function to actually move smoothly along a line.
  function update() {
    const elapsed = performance.now() - startTime;
    let t = elapsed / expectedDuration;
    if (t > 1) t = 1;
    camera.position.lerpVectors(startingPos, targetPos, t);

    if (t < 1) {
      requestAnimationFrame(update);
    } else if (typeof funcOnComplete === "function") {
      funcOnComplete();
    }
  }
  update();
}
