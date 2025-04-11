// levels/levelone.js
"use strict";

import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { cameraManager } from "../Util/Camera.js";
// Use the drone for player control.
import { createDrone } from "../robots/drone.js";
import Floor from "../tilesetc/floor.js";
import Wall from "../tilesetc/wall.js";
import Ramp from "../tilesetc/ramp.js";
import Steps from "../tilesetc/steps.js"; // Assumes you have a similar Steps file defined.
import { updateStats } from "../player/stats.js";
import checkHacks from "../robots/hax.js";

const clock = new THREE.Clock();

let playerDrone = null; // The player-controlled drone
let testWall = null; // A wall object for collision demonstration
let testRamp = null; // A ramp for slope adjustment
let testSteps = null; // A steps object for vertical movement demonstration

/**
 * startLevelOne
 * —————————
 * Sets up the scene with:
 *   • A ground floor at the origin (story 0)
 *   • A wall located at (0, 0, 20) on story 0
 *   • A ramp located at (30, 0, 0) on story 0
 *   • A set of steps located at (60, 0, 0) on story 0
 *   • The player drone starting at (0, 0, -10)
 */
export async function startLevelOne() {
  try {
    // Create the ground floor at (0,0,0) on story 0.
    const floor = new Floor({
      scene: cameraManager.scene,
      x: 0,
      z: 0,
      story: 0,
    });
    await waitForModelLoad(floor);

    // Create a vertical wall at (0,0,20) on story 0.
    testWall = new Wall({
      scene: cameraManager.scene,
      x: 0,
      z: 20,
      story: 0,
    });
    await waitForModelLoad(testWall);

    // Create a ramp at (30,0,0) on story 0.
    testRamp = new Ramp({
      scene: cameraManager.scene,
      x: 30,
      z: 0,
      story: 0,
    });
    await waitForModelLoad(testRamp);

    // Create a set of steps at (60,0,0) on story 0.
    testSteps = new Steps({
      scene: cameraManager.scene,
      x: 60,
      z: 0,
      story: 0,
    });
    await waitForModelLoad(testSteps);

    // Spawn the player-controlled drone at (0,0,-10).
    playerDrone = await createDrone(new THREE.Vector3(0, 0, -10));
    playerDrone.makePlayer();
    cameraManager.scene.add(playerDrone.model);

    // Begin the render/update loop.
    animate();
  } catch (err) {
    console.error("Error in startLevelOne:", err);
  }
}

/**
 * animate
 * —————
 * Per‑frame update: checks for hack input, refreshes HUD stats, updates entities,
 * updates ThreeMeshUI elements, and renders the scene.
 */
function animate() {
  requestAnimationFrame(animate);

  // Check for hack input on the player drone.
  if (playerDrone) checkHacks(playerDrone);

  // Refresh HUD (using HP as battery and current RAM).
  updateStats();

  const delta = clock.getDelta();

  // Update the player drone.
  if (playerDrone && playerDrone.update) playerDrone.update(delta);

  // Update the wall, ramp, and steps (for collision and/or special behavior).
  if (testWall && testWall.update) testWall.update(delta);
  if (testRamp && testRamp.update) testRamp.update(delta);
  if (testSteps && testSteps.update) testSteps.update(delta);

  // Update ThreeMeshUI elements (HUD, menus, etc.).
  ThreeMeshUI.update();

  // Render the scene.
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}

/**
 * waitForModelLoad
 * —————
 * Utility function to pause until an entity's model has loaded (i.e., has at least one child).
 * @param {Object} entity — The entity whose model children are checked.
 * @returns {Promise<void>}
 */
function waitForModelLoad(entity) {
  return new Promise((resolve) => {
    const check = () => {
      if (entity.model && entity.model.children.length) resolve();
      else setTimeout(check, 10);
    };
    check();
  });
}
