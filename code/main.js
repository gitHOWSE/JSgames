// main.js
"use strict";

//JAMES: Import necessary modules.
import { cameraManager } from "./Util/Camera.js";
import { GuiManager } from "./Util/Gui.js";
import { controller } from "./Util/Controller.js";
import { hudManager } from "./Util/Hud.js";
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { enableDebugging } from "./DebugTools.js";
import { startLevelOne, updateLevelOne } from "./levels/levelone.js";
import entityManager from "./entities/EntityManager.js";
import { assetLoader } from "./Util/AdvancedAssetLoader.js";
import { LoadingScreen } from "./Util/LoadingScreen.js";

window.controller = controller;
window.cameraManager = cameraManager;
window.player = null;

//JAMES: Global debug flag to toggle debugging tools.
const DEBUG = true;
const clock = new THREE.Clock();

//JAMES: Create the loading screen instance and add it to the camera early.
const loadingScreen = new LoadingScreen(cameraManager.camera);

//JAMES: Create the GUI manager and its start game panel.
window.guiManager = new GuiManager(cameraManager.camera);
window.guiManager.createStartGamePanel();

//JAMES: Integrate debugging tools if DEBUG flag is true.
let debugHelpers = null;
if (DEBUG) {
  debugHelpers = enableDebugging({
    scene: cameraManager.scene,
    camera: cameraManager.camera,
    renderer: cameraManager.renderer,
  });

  //JAMES: Ensure the stats panel is on top of the canvas
  if (debugHelpers.stats && debugHelpers.stats.dom) {
    debugHelpers.stats.dom.style.zIndex = "100";
  }
}

//JAMES: When the Start Game button is pressed, preload assets then start the level.
window.guiManager.showPanel("start", async () => {
  console.log("Start Game pressed");
  window.guiManager.hidePanel("start");

  //JAMES: Show the loading screen so the scene is hidden during load.
  loadingScreen.show();

  //JAMES: Preload assets.
  await assetLoader.loadAll();

  //JAMES: Hide the loading screen after asset loading completes.
  loadingScreen.hide();

  //JAMES: Then, start Level One.
  startLevelOne();
  let levelOne = true;
});

//JAMES: Main render and update loop.
function animate() {
  requestAnimationFrame(animate);

  if (debugHelpers && debugHelpers.stats) {
    debugHelpers.stats.begin();
  }

  const delta = clock.getDelta();
  entityManager.update();

  //JAMES: Update ThreeMeshUI (this includes the loading screen) each frame.
  ThreeMeshUI.update();
  window.guiManager.update();

  //JAMES: Render the scene.
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);

  if (debugHelpers && debugHelpers.stats) {
    debugHelpers.stats.end();
  }
  updateLevelOne(delta);
}

animate();

//JAMES: Instrumentation: every 5s, log scene & entity counts
if (DEBUG) {
  setInterval(() => {
    console.log(
      `//JAMES: Scene children: ${cameraManager.scene.children.length}, ` +
        `Entities: ${entityManager.getEntities().length}`,
    );
    // Optional: if Chrome, log JS heap
    if (performance.memory) {
      console.log(
        `//JAMES: JS Heap Used: ${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)} MB`,
      );
    }
  }, 5000);
}
