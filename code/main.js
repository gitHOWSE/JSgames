// main.js
"use strict";

//JAMES: Import necessary modules.
import { cameraManager } from "./Util/Camera.js";
import { GuiManager } from "./Util/Gui.js";
import { controller } from "./Util/Controller.js";
import { hudManager } from "./Util/Hud.js";
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { startLevelOne } from "./levels/levelone.js";
import { enableDebugging } from "./DebugTools.js";

window.controller = controller;
window.cameraManager = cameraManager;

//JAMES: Set a global debug flag to toggle debugging helpers.
const DEBUG = true; // Set to false to disable debugging visuals.

//JAMES: Create the GUI manager and its start game panel.
const guiManager = new GuiManager(cameraManager.camera);
guiManager.createStartGamePanel();

//JAMES: Integrate debugging tools if DEBUG flag is true.
let debugHelpers = null;
if (DEBUG) {
  debugHelpers = enableDebugging({
    scene: cameraManager.scene,
    camera: cameraManager.camera,
    renderer: cameraManager.renderer,
    //JAMES: vacuum and directionalLight can be passed in later when available.
    vacuum: null,
    directionalLight: null,
  });
}

//JAMES: When the Start Game button is pressed, hide the GUI, update the HUD, and start level one.
guiManager.showPanel("start", () => {
  console.log("Start Game pressed");
  guiManager.hidePanel("start");

  //JAMES: Example HUD update.
  hudManager.updateHUD(75, 100, 8192);

  //JAMES: Start Level One.
  startLevelOne();
});

//JAMES: Main animation loop.
function animate() {
  if (DEBUG && debugHelpers && debugHelpers.stats) {
    debugHelpers.stats.begin();
  }

  requestAnimationFrame(animate);

  //JAMES: Update debugging helpers if needed.
  if (DEBUG && debugHelpers) {
    if (window.vacuum && debugHelpers.boxHelper) {
      debugHelpers.boxHelper.update();
    }
    if (window.vacuum && debugHelpers.arrowHelper) {
      debugHelpers.arrowHelper.position.copy(window.vacuum.mesh.position);
      // Optionally update arrow direction if needed.
    }
  }

  //JAMES: Render the scene.
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);

  //JAMES: Update ThreeMeshUI and GUI.
  ThreeMeshUI.update();
  guiManager.update();

  if (DEBUG && debugHelpers && debugHelpers.stats) {
    debugHelpers.stats.end();
  }
}
animate();
