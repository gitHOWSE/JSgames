// levels/levelSetup.js
"use strict";

import * as THREE from "three";
import { cameraManager } from "../Util/Camera.js";
import MapGenerator from "../mapGeneration/MapGenerator.js";
import { tileManager } from "../tilesetc/tileManager.js";
import Floor from "../tilesetc/floor.js";
import Wall from "../tilesetc/wall.js";
import Ramp from "../tilesetc/ramp.js";
import Steps from "../tilesetc/steps.js";
import { Dog } from "../robots/dog.js";
import { Turret } from "../robots/turret.js";
import { createForklift } from "../robots/forklift.js";
import { createVacuum } from "../robots/vacuum.js";
import { createDrone } from "../robots/drone.js";
import entityManagerInstance from "../entities/EntityManager.js";
import { MapPopulator } from "../mapGeneration/MapPopulator.js";
import { createGoo } from "../robots/goo.js";
import { spawnEndLevelTerminal } from "../robots/endLevelBot.js";



export const TILE_SIZE_XZ = 12;
export const TILE_HEIGHT =TILE_SIZE_XZ-5;
let mapTileArray = null;
let mapLength = 0;
let mapWidth = 0;
let mapMaxHeight = 0;
let mapHalfX = 0;
let mapHalfZ = 0;

export async function setupLevel(level = 1) {
  const seed = Math.floor(Math.random() * 1000000);
  const mapGen = new MapGenerator(level, seed);
  mapGen.generateMap();
  const { tileArray, length, width, maxHeight } = mapGen;
  mapTileArray = tileArray;
  mapLength = length;
  mapWidth = width;
  mapMaxHeight = maxHeight;
  mapHalfX = length / 2;
  mapHalfZ = width / 2;

  console.log(mapLength);

  // Populate tileArray with enemy‐type tiles
  const populator = new MapPopulator(tileArray, level);
  const tilespawn = populator.populate();

  // Place static geometry (floors, walls, ramps, stairs)
  for (let x = 0; x < length; x++) {
    for (let y = 0; y < maxHeight; y++) {
      for (let z = 0; z < width; z++) {
        const tile = tilespawn[x][y][z];
        const type = tile.getType();
        const facing = tile.getFacing();

        const worldX = (x - mapHalfX) * TILE_SIZE_XZ;
        const worldZ = (z - mapHalfZ) * TILE_SIZE_XZ;
        const storyY = y;

        let instance = null;
        switch (type) {
          case "wall":
            instance = new Wall({ scene: cameraManager.scene, x: worldX, z: worldZ, story: storyY });
            break;
          case "floor":
            instance = new Floor({ scene: cameraManager.scene, x: worldX, z: worldZ, story: storyY });
            break;
          case "ramp":
            instance = new Ramp({ scene: cameraManager.scene, x: worldX, z: worldZ, story: storyY });
            break;
          case "stair":
            instance = new Steps({ scene: cameraManager.scene, x: worldX, z: worldZ, story: storyY });
            break;
          default:
            break;
        }

        if (instance) {
          if (typeof instance.setOrientationNorth === "function") {
            switch (facing) {
              case 0: instance.setOrientationNorth(); break;
              case 1: instance.setOrientationWest(); break;
              case 2: instance.setOrientationSouth(); break;
              case 3: instance.setOrientationEast(); break;
              default: instance.model.rotation.y = facing * (Math.PI / 2);
            }
          } else {
            instance.model.rotation.y = facing * (Math.PI / 2);
          }

          await tileManager.addTile(instance);
        }
      }
    }
  }

  // Spawn robots and enemies based on tile types
  for (let x = 0; x < length; x++) {
    for (let y = 0; y < maxHeight; y++) {
      for (let z = 0; z < width; z++) {
        const tile = tilespawn[x][y][z];
        const type = tile.getType();

        const worldX = (x - mapHalfX) * TILE_SIZE_XZ + TILE_SIZE_XZ/2;
        const worldZ = (z - mapHalfZ) * TILE_SIZE_XZ + TILE_SIZE_XZ/2;
        const worldY = TILE_HEIGHT * (y -1);

        const spawnPos =  getTileTopCenter(x, y, z);

        switch (type) {
          case "dogJockey":
            spawnDogJockey(spawnPos);
            console.log("DogJockey spawned at " + worldX + ", " + worldY + ", " + worldZ);

            break;
          case "turret":
            spawnTurret(spawnPos);
            console.log("Turret spawned at " + worldX + ", " + worldY + ", " + worldZ);

            break;
          case "vacuum":
            await spawnVacuum(spawnPos);
            console.log("Vacuum spawned at " + worldX + ", " + worldY + ", " + worldZ);

            break;
          case "android":
            await spawnForklift(spawnPos);
            console.log("Forklift spawned at " + worldX + ", " + worldY + ", " + worldZ);

            break;
          case "drone":
            await spawnDrone(spawnPos);
            console.log("Drone spawned at " + worldX + ", " + worldY + ", " + worldZ);
            break;
          case "dog":
            spawnDog(spawnPos);
            console.log("Dog spawned at " + worldX + ", " + worldY + ", " + worldZ);
            break;
          case "goo" :
            spawnGoo(spawnPos);
            console.log("Goo spawned at " + worldX + ", " + worldY + ", " + worldZ);
            break;
          case "goal" :
            spawnEndLevelTerminal(spawnPos);
            console.log("JAMES: EndLevelTerminal spawned at goal", spawnPos);
            break;
          default:
            break;
        }
      }
    }
  }

  console.log(`JAMES: Level generated with seed ${seed}.`);
}

export function spawnDogJockey(positionVec3) {
  const dogPo = new THREE.Vector3(4, 0, -4).add(positionVec3);
  const dog = Dog.spawn(cameraManager.scene, dogPo);
  const turret = new Turret({ scene: cameraManager.scene, position: dogPo.clone().add(new THREE.Vector3(-8, 0, 0)), host: dog });
  dog.attachTurret(turret);
  entityManagerInstance.addEntity(turret);
}

export async function spawnVacuum(positionVec3) {
  const vac = await createVacuum(positionVec3);
  cameraManager.scene.add(vac.model);
  entityManagerInstance.addEntity(vac);
  return vac;
}

export async function spawnForklift(positionVec3) {
  const fl = await createForklift(positionVec3);
  cameraManager.scene.add(fl.model);
  entityManagerInstance.addEntity(fl);
  return fl;
}

export function spawnTurret(positionVec3) {
  const tr = new Turret({ scene: cameraManager.scene, position: positionVec3 });
  cameraManager.scene.add(tr.model);
  entityManagerInstance.addEntity(tr);
  return tr;
}

export async function spawnDrone(positionVec3) {
  const dr = await createDrone(positionVec3);
  cameraManager.scene.add(dr.model);
  entityManagerInstance.addEntity(dr);
  return dr;
}

export function spawnDog(positionVec3) {
  const dog = Dog.spawn(cameraManager.scene, positionVec3);
  entityManagerInstance.addEntity(dog);
  return dog;
}
export function spawnGoo(positionVec3)
{const go =createGoo(positionVec3);
  entityManagerInstance.addEntity(go);
  return go;
}

export function findNearestTile(worldPos) {
  let gridX = Math.round(worldPos.x / TILE_SIZE_XZ + mapHalfX);
  let gridZ = Math.round(worldPos.z / TILE_SIZE_XZ + mapHalfZ);
  gridX = Math.min(Math.max(gridX, 0), mapLength - 1);
  gridZ = Math.min(Math.max(gridZ, 0), mapWidth - 1);
  console.log(`JAMES: Nearest tile grid coordinates: (${gridX}, ${gridZ})`);
  return { x: gridX, z: gridZ };
}

export function updateLevelTiles(delta) {
  tileManager.update(delta);
}

// NOTE TO JAMES: I defined TILE_HEIGHT as a static class variable for use in the robot spawning code. -Steven
export function getTileCenter(gridX, gridZ, storyLevel) {
  // JAMES: Find the story index below the impact level
  const belowStory = storyLevel - 1;
  if (belowStory < 0) {
    console.warn(
      `JAMES: getTileCenterBelow called with storyLevel=${storyLevel}, no tile below.`
    );
  }

  // JAMES: Compute X and Z exactly at the cube’s center
  const halfXZ = TILE_SIZE_XZ * 0.5;
  const worldX = (gridX - mapHalfX) * TILE_SIZE_XZ + halfXZ;
  const worldZ = (gridZ - mapHalfZ) * TILE_SIZE_XZ + halfXZ;

  // JAMES: Compute Y at half‑height of the cube below
  const halfY = TILE_HEIGHT * 0.5;
  const worldY = belowStory * -(-TILE_HEIGHT + halfY);

  return new THREE.Vector3(worldX, worldY, worldZ);
}


export function getTileTopCenter(gridX, gridZ, storyLevel) {
  // world‑X/Z center of the tile
  const halfXZ = TILE_SIZE_XZ * 0.5;
  const worldX = (gridX - mapHalfX) * TILE_SIZE_XZ + halfXZ;
  const worldZ = (gridZ - mapHalfZ) * TILE_SIZE_XZ + halfXZ;

  // world‑Y at the top of that story
  const worldY = storyLevel * TILE_HEIGHT;

  return new THREE.Vector3(worldX, worldY, worldZ);
}

/**
 * Scan the last‐generated tileArray for the 'start' tile
 * and return its grid coordinates.
 */
export function getStartGrid() {
  for (let x = 0; x < mapLength; x++) {
    for (let y = 0; y < mapMaxHeight; y++) {
      for (let z = 0; z < mapWidth; z++) {
        if (mapTileArray[x][y][z].getType() === 'goal') {
          return { x, y, z };
        }
      }
    }
  }
  throw new Error("No start tile found");
}

export function getStartWorldPos() {
  const { x, y, z } = getStartGrid();
  
  const halfXZ = TILE_SIZE_XZ * 0.5;
  const worldX = (x - mapHalfX) * TILE_SIZE_XZ + halfXZ;
  const worldZ = (z - mapHalfZ) * TILE_SIZE_XZ + halfXZ;
  
  const worldY = TILE_HEIGHT * (y - 1);
  return new THREE.Vector3(worldX, worldY, worldZ);
}
