// levels/levelone.js
"use strict";

import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { cameraManager } from "../Util/Camera.js";
import { createVacuum } from "../robots/vacuum.js";
import { createForklift } from "../robots/forklift.js";
import Floor from "../tilesetc/floor.js";
import { updateStats } from "../player/stats.js";
import { OnfloorLow, LOWPOLY_ONFLOOR_KEYS } from "../explosives/onfloor.js";
import { OnwallLow, LOWPOLY_ONWALL_KEYS } from "../explosives/onwall.js";

let vacuumPlayer = null;
let vacuumNPC = null;
let forklift = null;
import checkHacks from "/robots/hax.js";

import MapGenerator from "../mapGeneration/MapGenerator.js";

const mixers = [];
const clock = new THREE.Clock();

/**
 * startLevelOne
 * —————————
 * Sets up the player, NPCs, floor, and spawns all on‑floor and on‑wall
 * low‑poly assets for inspection.
 */
export async function startLevelOne() {
  try {
    //JAMES: Player vacuum at origin
    vacuumPlayer = await createVacuum(new THREE.Vector3(0, 0, 0));
    vacuumPlayer.makePlayer();
    cameraManager.scene.add(vacuumPlayer.model);

    //JAMES: Forklift to hack at (3,0,0)
    forklift = await createForklift(new THREE.Vector3(3, 0, 0));
    forklift.setHackable(true);
    forklift.setRobot();
    cameraManager.scene.add(forklift.model);

    //JAMES: NPC vacuum at (-3,0,0)
    vacuumNPC = await createVacuum(new THREE.Vector3(-3, 0, 0));
    vacuumNPC.setHackable(true);
    cameraManager.scene.add(vacuumNPC.model);

    //JAMES: Temporary floor entity for collisions (remove its mesh)
    const tempFloor = new Floor({ scene: cameraManager.scene });
    await waitForModelLoad(tempFloor);
    cameraManager.scene.remove(tempFloor.model);

    //JAMES: Spawn all low‑poly on‑floor assets in a centered row
    const floorSpacing = 4;
    const floorStartX = -((LOWPOLY_ONFLOOR_KEYS.length - 1) * floorSpacing) / 2;
    LOWPOLY_ONFLOOR_KEYS.forEach((assetName, i) => {
      const pos = new THREE.Vector3(floorStartX + i * floorSpacing, 0, -5);
      new OnfloorLow(assetName, pos, cameraManager.scene);
    });

    //JAMES: Spawn all low‑poly on‑wall assets in a second row above
    const wallSpacing = 4;
    const wallStartX = -((LOWPOLY_ONWALL_KEYS.length - 1) * wallSpacing) / 2;
    LOWPOLY_ONWALL_KEYS.forEach((assetName, i) => {
      const pos = new THREE.Vector3(
        wallStartX + i * wallSpacing,
        2, // Y = 2 units up the wall
        -8, // Z = -8 units back
      );
      new OnwallLow(assetName, pos, cameraManager.scene);
    });

    //JAMES: Kick off the render/update loop
    animate();
  } catch (err) {
    console.error("Error in startLevelOne:", err);
  }
}

/**
 * animate
 * —————
 * Per‑frame update: HUD, entity updates, UI rebuild, and render.
 */
function animate() {
  requestAnimationFrame(animate);

  //JAMES: Refresh HUD (HP‑as‑battery & RAM)
  updateStats();

  const delta = clock.getDelta();
  //JAMES: Update all entities
  if (vacuumPlayer && vacuumPlayer.update) vacuumPlayer.update(delta);
  if (vacuumNPC && vacuumNPC.update) vacuumNPC.update(delta);
  if (forklift && forklift.update) forklift.update(delta);

  //JAMES: Rebuild ThreeMeshUI elements (HUD, menus, etc.)
  ThreeMeshUI.update();

  //JAMES: Render the scene
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
