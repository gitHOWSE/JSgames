import { cameraManager } from "./Util/Camera.js";
import { GuiManager } from "./Util/Gui.js";
import { controller } from "./Util/Controller.js";
import { hudManager } from "./Util/Hud.js";
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";

// Create the GUI manager and its start game panel.
const guiManager = new GuiManager(cameraManager.camera);
guiManager.createStartGamePanel();

// When the Start Game button is pressed, hide the GUI and trigger the HUD update.
// You can pass custom values here; if omitted, default values (50, 100, 4096) are used.
guiManager.showPanel("start", () => {
  console.log("Start Game pressed");
  guiManager.hidePanel("start");
  // Example: battery current 75, max 100, RAM 8192.
  hudManager.updateHUD(75, 100, 8192);
});

// Animation loop.
function animate() {
  requestAnimationFrame(animate);
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
  ThreeMeshUI.update();
  guiManager.update();
}
animate();
