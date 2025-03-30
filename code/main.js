import { scene, camera, renderer } from "./Util/Camera.js";
import { GuiManager } from "./Util/Gui.js";
import * as THREE from "three";

// Position the camera so the GUI is in view
camera.position.set(0, 0, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Create the GUI manager and panel
const guiManager = new GuiManager(camera);
guiManager.createStartGamePanel();
guiManager.showPanel("start", () => {
  console.log("Start Game pressed");
  guiManager.hidePanel("start");
});

// For debugging, log the panel details.
console.log("Start panel:", guiManager.guiPanels.start.panel);

// (Optional) Add a cube for reference
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0, -5); // Cube is further away
scene.add(cube);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  guiManager.update();
}
animate();
