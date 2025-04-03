"use strict"; import { cameraManager } from "./Util/Camera.js"; import { GuiManager } from "./Util/Gui.js"; import { controller } from "./Util/Controller.js"; import { hudManager } from "./Util/Hud.js"; import * as THREE from "three"; import ThreeMeshUI from "three-mesh-ui"; import { startLevelOne } from "./levels/levelone.js";

//JAMES: Create the GUI manager and its start game panel.

const guiManager = new GuiManager(cameraManager.camera); guiManager.createStartGamePanel();

//JAMES: When the Start Game button is pressed, hide the GUI, update the HUD, and start level one.

guiManager.showPanel("start", () => {

  console.log("Start Game pressed");

  guiManager.hidePanel("start");

  // Example: battery current 75, max 100, RAM 8192. hudManager.updateHUD(75, 100, 8192);

  //JAMES: Start Level One.

  startLevelOne();
});

//JAMES: Animation loop.

function animate() { requestAnimationFrame(animate); cameraManager.renderer.render(cameraManager.scene, cameraManager.camera); ThreeMeshUI.update(); guiManager.update(); } animate();