// levels/levelone.js
"use strict";

import * as THREE from "three";
import { cameraManager } from "../Util/Camera.js";
import { createVacuum } from "../robots/vacuum.js";

let vacuum = null;
const clock = new THREE.Clock();

export async function startLevelOne() {
  try {
    // Create and await the vacuum model.
    vacuum = await createVacuum(new THREE.Vector3(0, 0, 0));

    // Mark this vacuum as the player-controlled entity.
    vacuum.makePlayer();

    // Add the vacuum's mesh to the scene.
    cameraManager.scene.add(vacuum.mesh);

    animate();
  } catch (error) {
    console.error("Error in startLevelOne:", error);
  }
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (vacuum && typeof vacuum.update === "function") {
    vacuum.update(delta);
  }
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}
