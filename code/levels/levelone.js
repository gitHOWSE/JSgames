// levels/levelone.js
"use strict";

import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { cameraManager } from "../Util/Camera.js";
import { createForklift } from "../robots/forklift.js";
import { updateStats } from "../player/stats.js";
import checkHacks from "../robots/hax.js";
// Import the new level setup helpers (assumes levelSetup.js exports these)
import { setupLevel, updateLevelTiles, findNearestTile } from "./levelSetup.js";

// JAMES: Declare the playerForklift variable so we can use it in the level.
export let playerForklift = null;

/**
 * startLevelOne
 * —————————
 * Sets up the level by generating the procedural map and then spawning
 * the player-controlled forklift at the origin.
 */
export async function startLevelOne() {
  // JAMES: Set up the procedural level.
  //  await setupLevel(1);

  // JAMES: Spawn the player forklift at (0, 0, 0).
  playerForklift = await createForklift(new THREE.Vector3(0, 0, 0));
  playerForklift.makePlayer();
  cameraManager.scene.add(playerForklift.model);
}

/**
 * updateLevelOne
 * —————————
 * Called each frame from the main loop. Processes hack input, updates HUD,
 * updates the player forklift, updates tiles via tileManager, and renders the scene.
 * @param {number} delta – Time elapsed since the last frame.
 */
export function updateLevelOne(delta) {
  // JAMES: Process hack input on the player-controlled forklift.
  if (playerForklift) checkHacks(playerForklift);

  // JAMES: Refresh the HUD (using HP as battery and current RAM).
  updateStats();

  // JAMES: Update the player forklift.
  if (playerForklift && playerForklift.update) {
    playerForklift.update(delta);
  }

  // JAMES: Throttled update of all registered tiles.
  updateLevelTiles(delta);

  ThreeMeshUI.update();
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}
