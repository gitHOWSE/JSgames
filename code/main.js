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
import entityManager from "./entities/EntityManager.js";
import { assetLoader } from "./Util/AdvancedAssetLoader.js";
import { LoadingScreen } from "./Util/LoadingScreen.js";

window.controller = controller;
window.cameraManager = cameraManager;

//JAMES: Global debug flag to toggle debugging tools.
const DEBUG = true;
const clock = new THREE.Clock();

//JAMES: Create the loading screen instance and add it to the camera early.
const loadingScreen = new LoadingScreen(cameraManager.camera);

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
  });
}

//JAMES: When the Start Game button is pressed, preload assets then start the level.
guiManager.showPanel("start", async () => {
  console.log("Start Game pressed");
  guiManager.hidePanel("start");

  //JAMES: Show the loading screen so the scene is hidden during load.
  loadingScreen.show();

  //JAMES: Preload assets.
  await assetLoader.loadAll();

  //JAMES: Hide the loading screen after asset loading completes.
  loadingScreen.hide();

  //JAMES: Then, start Level One.
  startLevelOne();
});

//JAMES: Main render and update loop.
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  entityManager.entities.forEach((ent) => ent.update(delta));

  //JAMES: Update ThreeMeshUI (this includes the loading screen) each frame.
  ThreeMeshUI.update();
  guiManager.update();

  //JAMES: Render the scene.
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}

animate();
