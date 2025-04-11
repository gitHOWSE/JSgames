// Util/Hud.js
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { cameraManager } from "./Camera.js";

export class HUDManager {
  constructor() {
    // Create a full‑screen UI container at z = -1 in front of the camera
    this.hudContainer = new ThreeMeshUI.Block({
      width: 1.5,
      height: 2,
      backgroundOpacity: 0,
      display: "block",
    });
    this.hudContainer.visible = false;
    cameraManager.camera.add(this.hudContainer);
    this.hudContainer.position.set(1.5, 0.08, -1);

    // Disable depth test so HUD always renders on top
    this._disableDepthTest(this.hudContainer);

    // Preload RAM icon texture once
    this.textureLoader = new THREE.TextureLoader();
    this.ramIconTexture = this.textureLoader.load(
      "pictures/ram.png",
      () => console.log("RAM icon loaded"),
      undefined,
      (err) => console.error("Failed to load RAM icon:", err),
    );

    //
    // ----- RAM Panel -----
    //
    this.ramPanel = new ThreeMeshUI.Block({
      width: 0.5,
      height: 0.3,
      backgroundOpacity: 0.5,
      backgroundColor: new THREE.Color(0x000000),
      padding: 0.01,
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "center",
      display: "block",
    });
    this.hudContainer.add(this.ramPanel);
    this.ramPanel.position.set(0.6, 0.8, 0);

    // RAM icon
    this.ramIcon = new ThreeMeshUI.Block({
      width: 0.2,
      height: 0.2,
      marginBottom: 0.01,
      backgroundTexture: this.ramIconTexture,
      display: "block",
    });

    // Text container (panel width 0.5 minus icon width 0.2 = 0.3)
    const ramTextContainer = new ThreeMeshUI.Block({
      width: 0.3,
      height: 0.12,
      backgroundColor: new THREE.Color(0x222222),
      backgroundOpacity: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 0.005,
      display: "block",
    });
    this.ramText = new ThreeMeshUI.Text({
      content: "0", // placeholder
      fontSize: 0.12,
      textColor: new THREE.Color(0xff00ff),
      fontFamily: "./fonts/VT323-Regular.json",
      fontTexture: "./fonts/VT323.png",
    });
    ramTextContainer.add(this.ramText);

    // Add both icon and text to the RAM panel
    this.ramPanel.add(this.ramIcon, ramTextContainer);

    //
    // ----- Battery (HP) Panel -----
    //
    this.batteryPanel = new ThreeMeshUI.Block({
      width: 0.6,
      height: 0.2,
      backgroundOpacity: 0.5,
      backgroundColor: new THREE.Color(0x000000),
      padding: 0.01,
      justifyContent: "center",
      alignItems: "start",
      display: "block",
    });
    this.hudContainer.add(this.batteryPanel);
    this.batteryPanel.position.set(-0.7, 0.9, 0);

    // HP fill bar
    this.batteryFill = new ThreeMeshUI.Block({
      width: 0.58,
      height: 0.18,
      backgroundColor: new THREE.Color(0x00ff00),
    });
    this.batteryPanel.add(this.batteryFill);
  }

  /**
   * Helper to disable depth testing on a ThreeMeshUI.Block and all its children
   */
  _disableDepthTest(block) {
    block.traverse((child) => {
      if (child.material) child.material.depthTest = false;
    });
  }

  /**
   * Update the HUD each frame.
   * @param {number} currentHP — current health value
   * @param {number} maxHP     — maximum health value
   * @param {number} ramValue  — current RAM pool value
   */
  updateHUD(currentHP = 50, maxHP = 100, ramValue = 4096) {
    // Scale the HP bar
    const pct = Math.max(0, Math.min(1, currentHP / maxHP));
    this.batteryFill.scale.x = pct;

    // Update RAM text
    this.ramText.set({ content: ramValue.toString() });

    // Make sure it’s visible
    this.hudContainer.visible = true;
  }

  show() {
    this.hudContainer.visible = true;
  }

  hide() {
    this.hudContainer.visible = false;
  }
}

export const hudManager = new HUDManager();
