// levels/levelone.js
"use strict";

import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { cameraManager } from "../Util/Camera.js";
import { createVacuum } from "../robots/vacuum.js";

import { createForklift } from "../robots/forklift.js";
import { updateStats } from "../player/stats.js";
import checkHacks from "../robots/hax.js";

import MapGenerator  from "../mapGeneration/MapGenerator.js";
import { MapPopulator } from "../mapGeneration/MapPopulator.js";

import { Navigation } from "../pathing/Navigation.js";

import MapGenerator  from "../mapGeneration/MapGenerator.js" ;
import { spawnTestAnimations } from "../robots/testAnimations.js";

import { setupLevel, updateLevelTiles, findNearestTile } from "./levelSetup.js";
import { Turret } from "../robots/turret.js";
import { Entity } from "../entities/Entity.js";
import entityManagerInstance from "../entities/EntityManager.js";
import { and } from "three/tsl";
import { Dog } from "../robots/dog.js";

// JAMES: Declare the playerForklift variable so we can use it in the level.
export let player = null;

/**
 * startLevelOne
 * —————————
 * Sets up the level by generating the procedural map and then spawning
 * the player-controlled forklift at the origin.
 */
export async function startLevelOne() {
  // JAMES: Set up the procedural level.
  await setupLevel(1);
  //let mapGen = new MapGenerator(1);
  //cameraManager.scene.add(mapGen.generateDebug());
  
  //let arr = mapGen.tileArray;
  //let mapPop = new MapPopulator(arr, 1);
  //arr = mapPop.populate();
  //let nav = new Navigation(arr);
  
  // STEVEN: Here's an example of how to get the vector for where to go next from nav
  //console.log(nav.getDirection(1,1,25,25));
  
  // STEVEN: Here's an example of how to get a random reachable point from nav
  //const { x, z } = nav.getRandomReachablePoint(1,1);
  //console.log("Random Reachable Point from (1, 1):",x,z);

  /*
  // STEVEN: Here's an example of getting a random point, and then using it to get a path
  // through the map to it. Note that nav.getPath returns an array of arrays. Each subarray
  // is an (x,z) coordinate pair of a step along the path to the goal
  const { x, z } = nav.getRandomReachablePoint(1,1); // getting a random goal
  const path = nav.getPath(x, z, 1,1);                     // getting a path to it

  for (let i = 0; i < path.length; i++)
  {
    console.log("Step",i,"=",path[i]);
  }*/

  player = await createVacuum(new THREE.Vector3(3, 0, 0));


  let trt = new Turret({
    scene: cameraManager.scene,
    position: new THREE.Vector3(6, 0, 6)
  });
  cameraManager.scene.add(trt.model);

  entityManagerInstance.addEntity(trt);

  const dogPos = new THREE.Vector3(-4, 0, -4);
  const dog = Dog.spawn(cameraManager.scene, dogPos);
  const tur = new Turret({ scene: cameraManager.scene, position: dogPos.clone(), host: dog });
  dog.attachTurret(tur);
  entityManagerInstance.addEntity(tur);



  const mixers = await spawnTestAnimations(cameraManager.scene);

  // JAMES: Store mixers for per-frame updating
  window.testMixers = mixers;

  // JAMES: Make the player-controlled forklift a player-controlled object.
  player.makePlayer();
  cameraManager.scene.add(player.model);
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
  if (window.player) checkHacks(window.player);

  // JAMES: Refresh the HUD (using HP as battery and current RAM).
  updateStats();

  // JAMES: Update the player forklift.
  if (player && player.update) {
    player.update(delta);
  }
  
  if (window.testMixers) {
    window.testMixers.forEach((m) => m.update(delta));
  }

  //console.log("Updating LevelOne")

  // JAMES: Throttled update of all registered tiles.
  updateLevelTiles(delta);
  for (const e of entityManagerInstance.getEntities()) {
    if ((typeof e.update === "function") ) e.update(delta);
  }

  ThreeMeshUI.update();
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}
