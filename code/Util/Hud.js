// Util/Hud.js
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { cameraManager } from "./Camera.js";

export class HUDManager {
  constructor() {
    // Create a full‑screen UI container at z = -1 in front of the camera
    this.hudContainer = new ThreeMeshUI.Block({
      fullScreen: true,
      distance: 1,
      backgroundOpacity: 0,
    });
    this.hudContainer.visible = false;
    cameraManager.camera.add(this.hudContainer);

    // Disable depth test so HUD always renders on top
    this.hudContainer.traverse((child) => {
      if (child.material) child.material.depthTest = false;
    });

    // Preload RAM icon texture once
    this.textureLoader = new THREE.TextureLoader();
    this.ramIconTexture = this.textureLoader.load(
      "pictures/ram.png",
      () => console.log("RAM icon loaded"),
      undefined,
      (err) => console.error("Failed to load RAM icon:", err),
    );

    // After fullScreen sizing, we can compute half‑width/height
    const halfW = this.hudContainer.width / 2;
    const halfH = this.hudContainer.height / 2;
    const pad = 0.05; // world‑unit padding from edges

    //
    // HP Bar (Battery) — Top‑Left
    //
    const barW = 0.6,
      barH = 0.2;
    this.batteryFill = new ThreeMeshUI.Block({
      width: barW - 0.02,
      height: barH - 0.02,
      backgroundColor: new THREE.Color(0x00ff00),
    });
    this.batteryPanel = new ThreeMeshUI.Block({
      width: barW,
      height: barH,
      backgroundOpacity: 0.5,
      backgroundColor: new THREE.Color(0x000000),
      padding: 0.01,
      justifyContent: "center",
      alignItems: "start",
    });
    this.batteryPanel.add(this.batteryFill);
    this.batteryPanel.position.set(
      -halfW + barW / 2 + pad,
      halfH - barH / 2 - pad,
      0,
    );
    this.hudContainer.add(this.batteryPanel);

    //
    // RAM Panel — Top‑Right
    //
    const ramW = 0.8,
      ramH = 0.4;
    this.ramText = new ThreeMeshUI.Text({
      content: "0",
      fontSize: 0.12,
      textColor: new THREE.Color(0xff00ff),
      fontFamily: "./fonts/VT323-Regular.json",
      fontTexture: "./fonts/VT323.png",
    });
    const ramIcon = new ThreeMeshUI.Block({
      width: 0.18,
      height: 0.18,
      marginBottom: 0.01,
      backgroundTexture: this.ramIconTexture,
    });
    const ramTextContainer = new ThreeMeshUI.Block({
      width: ramW - 0.2,
      height: 0.12,
      backgroundColor: new THREE.Color(0x222222),
      backgroundOpacity: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 0.005,
    });
    ramTextContainer.add(this.ramText);

    this.ramPanel = new ThreeMeshUI.Block({
      width: ramW,
      height: ramH,
      backgroundOpacity: 0.5,
      backgroundColor: new THREE.Color(0x000000),
      padding: 0.01,
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "center",
    });
    this.ramPanel.add(ramIcon, ramTextContainer);
    this.ramPanel.position.set(
      halfW - ramW / 2 - pad,
      halfH - ramH / 2 - pad,
      0,
    );
    this.hudContainer.add(this.ramPanel);
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
