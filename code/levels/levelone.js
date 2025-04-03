"use strict";

import * as THREE from "three";
import { cameraManager } from "../Util/Camera.js";
import { createVacuum } from "../robots/vacuum.js";

// Hold a reference to the vacuum entity.
let vacuum = null;
// Clock to manage delta time for animations.
const clock = new THREE.Clock();

// This function initializes Level One.
export function startLevelOne() {
  //JAMES: Create a vacuum entity at the origin.
  vacuum = createVacuum(new THREE.Vector3(0, 0, 0));

  //JAMES: Add the vacuum's mesh to the scene.
  cameraManager.scene.add(vacuum.mesh);

  //JAMES: Start the animation loop.
  animate();
}

// The main animation loop for Level One.
function animate() {
  requestAnimationFrame(animate);
  
  // Get the elapsed time since the last call.
  const delta = clock.getDelta();
  
  // If the vacuum exists, update its state.
  if (vacuum && typeof vacuum.update === "function") {
    vacuum.update(delta);
  }
  
  // Render the scene from the camera's perspective.
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}