import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { cameraManager } from "./Camera.js";

export class HUDManager {
  constructor() {
    // Create a HUD container with a fixed size (2x2 units); initially hidden.
    this.hudContainer = new ThreeMeshUI.Block({
      width: 2,
      height: 2,
      backgroundOpacity: 0,
    });
    this.hudContainer.visible = false;
    // Attach the HUD container to the camera.
    cameraManager.camera.add(this.hudContainer);
    // Position the container 2 units in front of the camera.
    this.hudContainer.position.set(0, 0, -1);
    this._disableDepthTest(this.hudContainer);

    // References for dynamic updates.
    this.batteryFill = null;
    this.ramText = null;
  }

  _disableDepthTest(object) {
    object.traverse((child) => {
      if (child.material) {
        child.material.depthTest = false;
      }
    });
  }

  // Update the HUD using provided parameters (with default values for demo).
  updateHUD(batteryCurrent = 50, batteryMax = 100, ramValue = 4096) {
    // Clear any existing children.
    while (this.hudContainer.children.length) {
      this.hudContainer.remove(this.hudContainer.children[0]);
    }

    // The HUD container spans X from -1 to 1 and Y from -1 to 1.
    const halfWidth = 1.02;
    const halfHeight = 1.02;
    const margin = -0.75;

    // ----- Top Left: Battery Panel -----
    const batteryPanel = new ThreeMeshUI.Block({
      width: 0.6,
      height: 0.2,
      backgroundColor: new THREE.Color(0x000000),
      padding: 0.01,
      justifyContent: "center",
      alignItems: "left",
    });
    // Position at top left.
    batteryPanel.position.set(-halfWidth + margin, halfHeight, 0);
    this.batteryFill = new ThreeMeshUI.Block({
      width: 0.58,
      height: 0.18,
      backgroundColor: new THREE.Color(0x00ff00),
    });
    // Calculate battery percentage.
    const batteryPercent = Math.max(
      0,
      Math.min(1, batteryCurrent / batteryMax),
    );
    this.batteryFill.scale.x = batteryPercent;
    batteryPanel.add(this.batteryFill);
    this.hudContainer.add(batteryPanel);

    // ----- Top Right: RAM Panel -----
    // Use a column layout to stack the RAM icon and the text container.
    const ramPanel = new ThreeMeshUI.Block({
      width: 0.8,
      height: 0.4,
      backgroundColor: new THREE.Color(0x000000),
      padding: 0.01,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    });
    // Position at top right.
    ramPanel.position.set(halfWidth - margin, halfHeight + margin / 8, 0);
    // Create the RAM icon block.
    const ramIcon = new ThreeMeshUI.Block({
      width: 0.18,
      height: 0.18,
      padding: 0,
      marginBottom: 0.01,
    });
    // Use a dummy texture until the real one loads.
    const dummyTexture = new THREE.Texture(document.createElement("canvas"));
    dummyTexture.image.width = 1;
    dummyTexture.image.height = 1;
    dummyTexture.needsUpdate = true;
    ramIcon.set({ backgroundTexture: dummyTexture });
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("pictures/ram.png", (texture) => {
      ramIcon.set({ backgroundTexture: texture });
    });
    // Create a container for the RAM text with its own background.
    const ramTextContainer = new ThreeMeshUI.Block({
      width: 0.6,
      height: 0.12,
      backgroundColor: new THREE.Color(0x222222),
      backgroundOpacity: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 0.005,
    });
    // Create the RAM text with bright purple color and a larger font.
    this.ramText = new ThreeMeshUI.Text({
      content: ramValue.toString(),
      fontSize: 0.12,
      textColor: new THREE.Color(0xff00ff),
      fontFamily: "./fonts/VT323-Regular.json",
      fontTexture: "./fonts/VT323.png",
    });
    ramTextContainer.add(this.ramText);
    // Add the RAM icon and then the text container.
    ramPanel.add(ramIcon);
    ramPanel.add(ramTextContainer);
    this.hudContainer.add(ramPanel);

    this.show();
  }

  show() {
    this.hudContainer.visible = true;
  }

  hide() {
    this.hudContainer.visible = false;
  }
}

export const hudManager = new HUDManager();
