// levels/levelone.js
"use strict";

import * as THREE from "three";
import { cameraManager } from "../Util/Camera.js";
import { createVacuum } from "../robots/vacuum.js";
import Floor from "../tilesetc/floor.js";
import { Resources } from "../Util/Resources.js"; //JAMES: Import Resources for cloning models

let vacuum = null;
const floorGrid = []; //JAMES: Store floor instances.
const testMeshes = []; //JAMES: Store all cloned test meshes.
const clock = new THREE.Clock();

export async function startLevelOne() {
  try {
    //JAMES: Create and await the vacuum model.
    vacuum = await createVacuum(new THREE.Vector3(0, 0, 0));
    //JAMES: Mark vacuum as player-controlled.
    vacuum.makePlayer();
    //JAMES: Add the vacuum's mesh to the scene.
    cameraManager.scene.add(vacuum.mesh);

    //JAMES: Create one Floor instance to determine its dimensions.
    const tempFloor = new Floor({ scene: cameraManager.scene });
    //JAMES: Wait until the floor model has loaded.
    await waitForModelLoad(tempFloor);
    //JAMES: Start the animation loop.
    animate();
  } catch (error) {
    //JAMES: Log any errors during level initialization.
    console.error("Error in startLevelOne:", error);
  }
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  //JAMES: Update the vacuum if it has an update method.
  if (vacuum && typeof vacuum.update === "function") {
    vacuum.update(delta);
  }
  //JAMES: Render the scene using the active camera.
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}

//JAMES: Helper to wait until the model (on a Floor instance) is loaded.
function waitForModelLoad(floor) {
  return new Promise((resolve) => {
    const check = () => {
      if (floor.model && floor.model.children.length > 0) {
        resolve();
      } else {
        setTimeout(check, 10);
      }
    };
    check();
  });
}
