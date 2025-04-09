// levels/levelone.js
"use strict";

import * as THREE from "three";
import { cameraManager } from "../Util/Camera.js";
import { createVacuum } from "../robots/vacuum.js";
import Floor from "../tilesetc/floor.js";
import { Resources } from "../Util/Resources.js"; //JAMES: Import Resources for cloning models

let vacuum = null;
const testMeshes = []; //JAMES: Store all cloned test meshes.
const clock = new THREE.Clock();

export async function startLevelOne() {
  try {
    //JAMES: Create and await the vacuum model.
    vacuum = await createVacuum(new THREE.Vector3(0, 0, 0));
    vacuum.makePlayer(); //JAMES: Mark vacuum as player.
    cameraManager.scene.add(vacuum.mesh); //JAMES: Add vacuum to scene.

    //JAMES: Create one Floor instance to ensure the floor model is loaded.
    const tempFloor = new Floor({ scene: cameraManager.scene });
    await waitForModelLoad(tempFloor); //JAMES: Wait until the floor is ready.
    cameraManager.scene.remove(tempFloor.model);

    //JAMES: List of static low‑poly model keys from the manifest.
    const staticKeys = [
      "plasmaLow",
      "bombLow",
      "blueFridgeLow",
      "mysteryBoxLow",
      "oldSchoolTowerLow",
      "snackMachineLow",
      "storageCabinetLow",
      "vintageOscilloscopeLow",
      "accessTerminalLow",
      "espressoDreamerLow",
      "ecoBotWheelerLow",
      "forkliftBotLow",
      "redAerialExplorerLow",
      "roboticControlLow",
      "roboticVacuumCharmLow",
      "steampunkSentinelLow",
    ];

    //JAMES: Clone each static model and lay them out in a line, 10 units apart.
    for (let i = 0; i < staticKeys.length; i++) {
      const key = staticKeys[i];
      const meshClone = await Resources.cloneFromManifest(key);
      meshClone.position.set(i * 10, 0, 0);
      cameraManager.scene.add(meshClone);
      testMeshes.push(meshClone);
    }

    //JAMES: Start the animation loop.
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

//JAMES: Helper to wait until the floor model has loaded.
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
