import { scene, camera, renderer } from "./Util/Camera.js";
import { GuiManager } from "./Util/Gui.js";
import { Controller } from "./Util/Controller.js";
import * as THREE from "three";

// Create the GUI manager and panel
const guiManager = new GuiManager(camera);
guiManager.createStartGamePanel();
guiManager.showPanel("start", () => {
  console.log("Start Game pressed");
  guiManager.hidePanel("start");
  const controller = new Controller();
});
// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  guiManager.update();
}
animate();
