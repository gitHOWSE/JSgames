// levels/levelone.js
"use strict";

import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";

import { cameraManager } from "../Util/Camera.js";
import { createDrone } from "../robots/drone.js";
import { updateStats } from "../player/stats.js";
import checkHacks from "../robots/hax.js";

import MapGenerator from "../mapGeneration/MapGenerator.js";
import { tileManager } from "../tilesetc/tileManager.js";
import Floor from "../tilesetc/floor.js";
import Wall from "../tilesetc/wall.js";
import Ramp from "../tilesetc/ramp.js";
import Steps from "../tilesetc/steps.js";

export let playerDrone = null;

// JAMES: This constant must match the scale used in your tile classes (tile grid spacing).
const TILE_SIZE_XZ = 12;

/**
 * startLevelOne
 * —————————
 * Generates a procedural map, instantiates every tile into the scene (and registers each tile
 * with the TileManager for throttled updates), then spawns the player-controlled drone at the center.
 */
export async function startLevelOne() {
  // JAMES: 1) Build the logical map.
  const mapGen = new MapGenerator(1, Math.random());
  mapGen.generateMap();
  const { tileArray, length, width, maxHeight } = mapGen;

  // JAMES: Calculate half-dimensions so that the map is centered at the origin.
  const halfX = length / 2;
  const halfZ = width / 2;

  // JAMES: 2) Instantiate every tile in the map.
  for (let x = 0; x < length; x++) {
    for (let y = 0; y < maxHeight; y++) {
      for (let z = 0; z < width; z++) {
        const tile = tileArray[x][y][z];
        const type = tile.getType();
        const facing = tile.getFacing();

        // JAMES: Compute the world position of each tile so that the grid is centered.
        const worldX = (x - halfX) * TILE_SIZE_XZ;
        const worldZ = (z - halfZ) * TILE_SIZE_XZ;
        const storyY = y; // Each tile class will interpret this "story" value to adjust Y internally.

        let instance = null;

        // JAMES: Create a tile instance based on its type.
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
            // JAMES: Set the ramp's orientation based on the facing value.
            // If the instance provides explicit orientation methods, use them.
            if (
              typeof instance.setOrientationNorth === "function" &&
              typeof instance.setOrientationEast === "function"
            ) {
              switch (facing) {
                case 0:
                  instance.setOrientationNorth();
                  break;
                case 1:
                  instance.setOrientationEast();
                  break;
                case 2:
                  instance.setOrientationSouth();
                  break;
                case 3:
                  instance.setOrientationWest();
                  break;
                default:
                  instance.model.rotation.y = facing * (Math.PI / 2);
              }
            } else {
              // JAMES: Fallback orientation by directly modifying the Y rotation.
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
            // JAMES: Rotate the steps based on the facing value.
            instance.model.rotation.y = facing * (Math.PI / 2);
            break;

          // JAMES: Skip other tile types (e.g. 'air').
        }

        // JAMES: If an instance was created, add it to the tile manager.
        if (instance) {
          // JAMES: await ensures the tile is definitely added.
          await tileManager.addTile(instance);
        }
      }
    }
  }

  // JAMES: 3) Spawn the player-controlled drone at the center of the ground floor (story 1).
  const spawnGridX = Math.floor(length / 2);
  const spawnGridZ = Math.floor(width / 2);
  const spawnWorldX = (spawnGridX - halfX) * TILE_SIZE_XZ;
  const spawnWorldZ = (spawnGridZ - halfZ) * TILE_SIZE_XZ;
  const spawnY = 1; // Story index 1 corresponds to the second layer.

  playerDrone = await createDrone(
    new THREE.Vector3(spawnWorldX, spawnY, spawnWorldZ),
  );
  playerDrone.makePlayer();
  cameraManager.scene.add(playerDrone.model);
}

/**
 * updateLevelOne
 * —————————
 * Call this function every frame (passing delta time) from your main loop.
 * It processes hack input, refreshes HUD stats, updates the player and all tiles via the tile manager,
 * rebuilds UI elements, and renders the scene.
 * @param {number} delta - Time elapsed since the last frame.
 */
export function updateLevelOne(delta) {
  // JAMES: Process hack input on the player-controlled drone.
  if (playerDrone) checkHacks(playerDrone);

  // JAMES: Refresh the HUD (using HP as battery and current RAM).
  updateStats();

  // JAMES: Update the player-controlled drone.
  if (playerDrone && playerDrone.update) {
    playerDrone.update(delta);
  }

  // JAMES: Throttled update of all registered tiles.
  tileManager.update(delta);

  // JAMES: Rebuild any ThreeMeshUI elements (HUD, menus, etc.).
  ThreeMeshUI.update();

  // JAMES: Render the scene.
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}
