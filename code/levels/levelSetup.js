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

// JAMES: Grid spacing must match the scale used by your tile classes.
const TILE_SIZE_XZ = 12;

// JAMES: These module‑level variables hold map parameters for later use.
let mapTileArray = null;
let mapLength = 0;
let mapWidth = 0;
let mapMaxHeight = 0;
let mapHalfX = 0;
let mapHalfZ = 0;

/**
 * JAMES: Asynchronously sets up a level.
 * @param {number} level - Level number (affects generation parameters).
 */
export async function setupLevel(level = 1) {
  // JAMES: Create a random integer seed.
  const seed = Math.floor(Math.random() * 1000000);

  // JAMES: Generate the procedural map.
  const mapGen = new MapGenerator(level, seed);
  mapGen.generateMap();
  const { tileArray, length, width, maxHeight } = mapGen;
  // Save these for lookup later.
  mapTileArray = tileArray;
  mapLength = length;
  mapWidth = width;
  mapMaxHeight = maxHeight;
  mapHalfX = length / 2;
  mapHalfZ = width / 2;

  // JAMES: Loop over every tile in the generated tile array.
  for (let x = 0; x < length; x++) {
    for (let y = 0; y < maxHeight; y++) {
      for (let z = 0; z < width; z++) {
        const tile = tileArray[x][y][z];
        const type = tile.getType();
        const facing = tile.getFacing();

        // JAMES: Compute world position for grid tile so that the map is centered.
        const worldX = (x - mapHalfX) * TILE_SIZE_XZ;
        const worldZ = (z - mapHalfZ) * TILE_SIZE_XZ;
        const storyY = y; // Each tile class interprets the story value for its Y position.

        let instance = null;
        switch (type) {
          case "wall":
            instance = new Wall({
              scene: cameraManager.scene,
              x: worldX,
              z: worldZ,
              story: storyY,
            });
            break;

          case "floor":
            instance = new Floor({
              scene: cameraManager.scene,
              x: worldX,
              z: worldZ,
              story: storyY,
            });
            break;

          case "ramp":
            instance = new Ramp({
              scene: cameraManager.scene,
              x: worldX,
              z: worldZ,
              story: storyY,
            });
            // JAMES: Set ramp orientation based on facing value.
            if (typeof instance.setOrientationNorth === "function") {
              switch (facing) {
                case 0:
                  instance.setOrientationNorth();
                  break;
                case 1:
                  instance.setOrientationWest();
                  break;
                case 2:
                  instance.setOrientationSouth();
                  break;
                case 3:
                  instance.setOrientationEast();
                  break;
                default:
                  instance.model.rotation.y = facing * (Math.PI / 2);
              }
            } else {
              instance.model.rotation.y = facing * (Math.PI / 2);
            }
            break;

          case "stair":
            instance = new Steps({
              scene: cameraManager.scene,
              x: worldX,
              z: worldZ,
              story: storyY,
            });
            instance.model.rotation.y = facing * (Math.PI / 2);
            break;

          // JAMES: Skip other types (e.g. "air").
        }

        if (instance) {
          // JAMES: Await registration so the tile is definitely in the TileManager.
          await tileManager.addTile(instance);
        }
      }
    }
  }

  console.log(`JAMES: Level generated with seed ${seed}.`);
}

/**
 * JAMES: Helper function that finds the nearest grid tile to a given world position.
 * Returns an object with grid indices { x, z }.
 * @param {THREE.Vector3} worldPos - The world position to query.
 * @returns {Object} – Object with properties x and z representing grid indices.
 */
export function findNearestTile(worldPos) {
  // JAMES: Compute grid indices based on world coordinates.
  let gridX = Math.round(worldPos.x / TILE_SIZE_XZ + mapHalfX);
  let gridZ = Math.round(worldPos.z / TILE_SIZE_XZ + mapHalfZ);

  // JAMES: Clamp indices to valid ranges.
  gridX = Math.min(Math.max(gridX, 0), mapLength - 1);
  gridZ = Math.min(Math.max(gridZ, 0), mapWidth - 1);

  console.log(`JAMES: Nearest tile grid coordinates: (${gridX}, ${gridZ})`);
  return { x: gridX, z: gridZ };
}

export function updateLevelTiles(delta) {
  tileManager.update(delta);
}
