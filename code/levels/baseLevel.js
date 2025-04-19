// levels/BaseLevel.js
"use strict";

import * as THREE from "three";
import { setupLevel, getStartWorldPos } from "./levelSetup.js";
import { updateStats } from "../player/stats.js";
import checkHacks from "../robots/hax.js";
import { spawnTestAnimations } from "../robots/testAnimations.js";
import { tileManager } from "../tilesetc/tileManager.js";
import entityManager from "../entities/EntityManager.js";
import ThreeMeshUI from "three-mesh-ui";
import { cameraManager } from "../Util/Camera.js";

// JAMES: BaseLevel encapsulates shared logic for starting and updating any level.
export default class BaseLevel {
  /**
   * @param {number} levelNum — the procedural map difficulty level.
   * @param {function(THREE.Vector3): Promise<Entity>} spawnFn — async factory for the player entity.
   */
  constructor(levelNum, spawnFn) {
    this.levelNum = levelNum;
    this.spawnFn = spawnFn;
    this.player = null;
    this.mixers = [];
  }

  /**
   * JAMES: set up the procedural map, spawn and initialize the player, and start test animations.
   */
  async start() {
    // JAMES: set global level so other systems can reference it.
    window.level = this.levelNum;

    // JAMES: generate and populate the level geometry and entities.
    await setupLevel(this.levelNum);

    // JAMES: determine the starting world position from the map.
    const startPos = getStartWorldPos();

    // JAMES: spawn the player-controlled entity at the start position.
    this.player = await this.spawnFn(startPos);
    this.player.makePlayer();
    cameraManager.scene.add(this.player.model);

    // JAMES: spawn test animations into the scene for debugging.
    this.mixers = await spawnTestAnimations(cameraManager.scene);
  }

  /**
   * @param {number} delta — time elapsed since last frame in seconds.
   * JAMES: called each frame to update player, animations, tiles, entities, UI, and rendering.
   */
  update(delta) {
    // JAMES: process hacking input on the player-controlled entity.
    if (this.player) checkHacks(this.player);

    // JAMES: update player stats in the HUD.
    updateStats();

    // JAMES: advance player physics and behaviors.
    if (this.player.update) this.player.update(delta);

    // JAMES: advance all test animation mixers.
    this.mixers.forEach((m) => m.update(delta));

    // JAMES: update all registered tiles (e.g., dynamic geometry or effects).
    tileManager.update(delta);

    // JAMES: update every other entity in the scene.
    for (const e of entityManager.getEntities()) {
      if (typeof e.update === "function") e.update(delta);
    }

    // JAMES: update any ThreeMeshUI components.
    ThreeMeshUI.update();

    // JAMES: render the current scene through the camera.
    cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
  }
}
