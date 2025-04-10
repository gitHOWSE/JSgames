// levels/levelone.js
"use strict";

import * as THREE from "three";
import { cameraManager } from "../Util/Camera.js";
import { createVacuum } from "../robots/vacuum.js";
import { createForklift } from "../robots/forklift.js";
import Floor from "../tilesetc/floor.js";

let vacuumPlayer = null;
let vacuumNPC = null;
let forklift = null;
const mixers = [];
const clock = new THREE.Clock();

export async function startLevelOne() {
  try {
    // Player Vacuum
    vacuumPlayer = await createVacuum(new THREE.Vector3(0, 0, 0));
    vacuumPlayer.makePlayer();
    cameraManager.scene.add(vacuumPlayer.model);

    // Forklift to hack
    forklift = await createForklift(new THREE.Vector3(3, 0, 0));
    forklift.setHackable(true);
    forklift.setRobot();
    cameraManager.scene.add(forklift.model);

    // Extra vacuum (non-player)
    vacuumNPC = await createVacuum(new THREE.Vector3(-3, 0, 0)); // Off to the left
    vacuumNPC.setHackable(true); // Optional for testing
    cameraManager.scene.add(vacuumNPC.model);

    // Floor
    const tempFloor = new Floor({ scene: cameraManager.scene });
    await waitForModelLoad(tempFloor);
    cameraManager.scene.remove(tempFloor.model);

    animate();
  } catch (err) {
    console.error("Error in startLevelOne:", err);
  }
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (vacuumPlayer && vacuumPlayer.update) vacuumPlayer.update(delta);
  if (vacuumNPC && vacuumNPC.update) vacuumNPC.update(delta);
  if (forklift && forklift.update) forklift.update(delta);

  mixers.forEach((m) => m.update(delta));

  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}

function waitForModelLoad(floor) {
  return new Promise((resolve) => {
    const check = () => {
      if (floor.model && floor.model.children.length) resolve();
      else setTimeout(check, 10);
    };
    check();
  });
}
