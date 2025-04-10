// Util/Hud.js
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { cameraManager } from "./Camera.js";

export class HUDManager {
  constructor() {
    // 1) Root container: full‑screen, transparent, block‑display so children use absolute positions
    this.hudContainer = new ThreeMeshUI.Block({
      width: 2,
      height: 2,
      backgroundOpacity: 0,
      display: "block",
    });
    this.hudContainer.visible = false;
    cameraManager.camera.add(this.hudContainer);
    this.hudContainer.position.set(0, 0, -1);
    this._disableDepthTest(this.hudContainer);

    // 2) Preload RAM icon once
    this.textureLoader = new THREE.TextureLoader();
    this.ramIconTexture = this.textureLoader.load(
      "pictures/ram.png",
      () => console.log("RAM icon loaded"),
      undefined,
      (err) => console.error("Failed to load RAM icon:", err),
    );

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
      display: "block", // also block so its children can position freely if needed
    });
    // absolute position: center at (–0.7, 0.9)
    this.batteryPanel.position.set(-0.7, 0.9, 0);
    this.hudContainer.add(this.batteryPanel);

    // fill bar
    this.batteryFill = new ThreeMeshUI.Block({
      width: 0.58,
      height: 0.18,
      backgroundColor: new THREE.Color(0x00ff00),
    });
    this.batteryPanel.add(this.batteryFill);

    //
    // ----- RAM Panel -----
    //
    this.ramPanel = new ThreeMeshUI.Block({
      width: 0.8,
      height: 0.4,
      backgroundOpacity: 0.5,
      backgroundColor: new THREE.Color(0x000000),
      padding: 0.01,
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "center",
      display: "block",
    });
    // absolute position: center at (0.6, 0.8)
    this.ramPanel.position.set(0.6, 0.8, 0);
    this.hudContainer.add(this.ramPanel);

    // RAM icon
    this.ramIcon = new ThreeMeshUI.Block({
      width: 0.18,
      height: 0.18,
      marginBottom: 0.01,
      backgroundTexture: this.ramIconTexture,
      display: "block",
    });
    this.ramPanel.add(this.ramIcon);

    // RAM text container
    const ramTextContainer = new ThreeMeshUI.Block({
      width: 0.6,
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
    this.ramPanel.add(ramTextContainer);
  }

  _disableDepthTest(object) {
    object.traverse((child) => {
      if (child.material) child.material.depthTest = false;
    });
  }

  /**
   * Call each frame to update the HP bar and RAM text.
   * @param {number} currentHP — current health
   * @param {number} maxHP     — max health
   * @param {number} ramValue  — current RAM
   */
  updateHUD(currentHP = 50, maxHP = 100, ramValue = 4096) {
    // HP fill
    const fillPct = Math.max(0, Math.min(1, currentHP / maxHP));
    this.batteryFill.scale.x = fillPct;

    // RAM text
    this.ramText.set({ content: ramValue.toString() });

    // make sure it’s visible
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
