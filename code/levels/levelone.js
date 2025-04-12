// levels/levelone.js
"use strict";

import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";

import { cameraManager } from "../Util/Camera.js";
import { createDrone } from "../robots/drone.js";
import { updateStats } from "../player/stats.js";
import checkHacks from "../robots/hax.js";

// Import the new level setup helpers (assumes levelSetup.js exports these)
import { setupLevel, updateLevelTiles, findNearestTile } from "./levelSetup.js";

export let playerDrone = null;

// JAMES: Setup level using levelSetup functions.
export async function startLevelOne() {
  // Generate the procedural map for level 1.
  await setupLevel(1);

  // Spawn the player drone at a chosen spawn point.
  // For example, use findNearestTile (if implemented) to pick a spawn location.
  // Here, we simply use the origin.
  const spawnPos = new THREE.Vector3(0, 0, 0);
  playerDrone = await createDrone(spawnPos);
  playerDrone.makePlayer();
  cameraManager.scene.add(playerDrone.model);
}

// JAMES: Update level components every frame.
export function updateLevelOne(delta) {
  if (playerDrone) checkHacks(playerDrone);
  updateStats();
  if (playerDrone && playerDrone.update) playerDrone.update(delta);

  // Update tiles with throttling via tileManager.
  updateLevelTiles(delta);

  ThreeMeshUI.update();
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}
