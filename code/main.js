// main.js
"use strict";

const saved = sessionStorage.getItem("level");
window.level = saved !== null ? Number(saved) : 1;

// JAMES: Import necessary modules.
import { cameraManager } from "./Util/Camera.js";
import { GuiManager } from "./Util/Gui.js";
import { controller } from "./Util/Controller.js";
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { enableDebugging } from "./DebugTools.js";
import entityManager from "./entities/EntityManager.js";
import { assetLoader } from "./Util/AdvancedAssetLoader.js";
import { LoadingScreen } from "./Util/LoadingScreen.js";

// JAMES: Expose globals.
window.controller = controller;
window.cameraManager = cameraManager;
window.maxHeight = 44;


// JAMES: Global debug flag.
window.DEBUG = true;
const DEBUG = window.DEBUG;

// JAMES: Clock for delta timing.
const clock = new THREE.Clock();

// JAMES: Loading screen setup.
const loadingScreen = new LoadingScreen(cameraManager.camera);

// JAMES: Origin helper object.
const origin = new THREE.Object3D();
origin.position.set(0, 0, 0);
window.origin = origin;

// JAMES: GUI manager and start panel.
window.guiManager = new GuiManager(cameraManager.camera);
window.guiManager.createStartGamePanel();

// JAMES: Immediately show the start‐game panel (and register its callback)
window.guiManager.showPanel("start", async () => {
  console.log("Start Game pressed");
  window.guiManager.hidePanel("start");

  // Show loading screen and preload
  loadingScreen.show();
  await assetLoader.loadAll();
  loadingScreen.hide();

  // Dynamically import and launch the correct level module
  const levelModule = await import(`./levels/level${window.level}.js`);
  currentLevel = levelModule.default;
  await currentLevel.start();
});

// JAMES: Debugging helpers.
let debugHelpers = null;
if (DEBUG) {
  debugHelpers = enableDebugging({
    scene: cameraManager.scene,
    camera: cameraManager.camera,
    renderer: cameraManager.renderer,
  });
  // JAMES: Ensure stats panel is on top.
  if (debugHelpers.stats?.dom) {
    debugHelpers.stats.dom.style.zIndex = "100";
  }
}

// JAMES: Reference to the current level module instance.
let currentLevel = null;

// JAMES: Start Game button callback.
window.guiManager.showPanel("start", async () => {
  console.log("Start Game pressed");
  window.guiManager.hidePanel("start");

  // JAMES: Show loading screen and preload assets.
  loadingScreen.show();
  await assetLoader.loadAll();
  loadingScreen.hide();

  // JAMES: Dynamically import the level module for the current level.
  const levelModule = await import(`./levels/level${window.level}.js`);
  currentLevel = levelModule.default;

  // JAMES: Start the level.
  await currentLevel.start();
});

// JAMES: Main animation loop.
function animate() {
  requestAnimationFrame(animate);

  if (debugHelpers?.stats) debugHelpers.stats.begin();

  // JAMES: Update entity manager.
  entityManager.update();

  // JAMES: Update UI frameworks.
  ThreeMeshUI.update();
  window.guiManager.update();

  // JAMES: Compute time delta.
  const delta = clock.getDelta();

  // JAMES: Render or delegate to current level.
  if (currentLevel) {
    currentLevel.update(delta);
  } else {
    cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
  }

  if (debugHelpers?.stats) debugHelpers.stats.end();
}

animate();

// JAMES: Instrumentation: log scene and entity counts every 5 seconds.
if (DEBUG) {
  setInterval(() => {
    console.log(
      `//JAMES: Scene children: ${cameraManager.scene.children.length}, Entities: ${entityManager.getEntities().length}`
    );
    if (performance.memory) {
      console.log(
        `//JAMES: JS Heap Used: ${Math.round(
          performance.memory.usedJSHeapSize / 1024 / 1024
        )} MB`
      );
    }
  }, 5000);
}
