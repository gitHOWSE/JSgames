// levels/levelone.js
"use strict";

import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { cameraManager } from "../Util/Camera.js";
import { createVacuum } from "../robots/vacuum.js";

import { createForklift } from "../robots/forklift.js";
import { updateStats } from "../player/stats.js";
import checkHacks from "../robots/hax.js";
import MapGenerator  from "../mapGeneration/MapGenerator.js" ;

import { setupLevel, updateLevelTiles, findNearestTile } from "./levelSetup.js";
import { Turret } from "../robots/turret.js";
import { Entity } from "../entities/Entity.js";
import entityManagerInstance from "../entities/EntityManager.js";
import { and } from "three/tsl";

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
  //await setupLevel(1);
  //let mapGen = new MapGenerator(1);
  //cameraManager.scene.add(mapGen.generateDebug());

  playerForklift = await createVacuum(new THREE.Vector3(3, 0, 0));

  let trt = new Turret({
    scene: cameraManager.scene,
    position: new THREE.Vector3(6, 0, 6)
  });
  entityManagerInstance.addEntity(trt);
  cameraManager.scene.add(trt.model);
  

  // JAMES: Make the player-controlled forklift a player-controlled object.
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

  console.log("Updating LevelOne")

  // JAMES: Throttled update of all registered tiles.
  updateLevelTiles(delta);
  for (const e of entityManagerInstance.getEntities()) {
    if ((typeof e.update === "function") ) e.update(delta);
  }

  ThreeMeshUI.update();
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}
