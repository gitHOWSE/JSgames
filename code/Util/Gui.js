// Util/Gui.js
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { cameraManager } from "./Camera.js"; // Attach panels to the scene.

let scene = cameraManager.scene;

export class GuiManager {
  constructor(camera) {
    this.camera = camera;
    this.guiPanels = {}; // Panels keyed by name.
    this.activePanel = null;
    this.previousPanel = null; // For restoring when closing settings.
    this.waitingForKey = null; // Which control is awaiting reassignment.

    // Default control bindings.
    this.controlBindings = {
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
      altMovement: "Shift",
      action1: "Z",
      action2: "X",
      action3: "C",
      pause: "Escape",
    };

    // Shared event handling for interactions.
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener("mousemove", this._onMouseMove.bind(this));
    window.addEventListener("click", this._onClick.bind(this));
    window.addEventListener("keydown", this._onKeyDown.bind(this));
  }

  // Create a generic panel.
  _createPanel(options) {
    let panelWidth = options.width || 1.2;
    let panelHeight = options.height || 0.6;
    if (options.fullScreen) {
      const distance = options.distance || 2;
      const fov = THREE.MathUtils.degToRad(this.camera.fov);
      panelHeight = 2 * Math.tan(fov / 2) * distance;
      panelWidth = panelHeight * this.camera.aspect;
    }
    const panel = new ThreeMeshUI.Block({
      width: panelWidth,
      height: panelHeight,
      padding: options.padding || 0.05,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: options.backgroundColor
        ? new THREE.Color(options.backgroundColor)
        : new THREE.Color(0x708090),
      backgroundOpacity: 1,
      borderRadius: options.borderRadius || 0.05,
      fontFamily: options.fontFamily || "./fonts/VT323-Regular.json",
      fontTexture: options.fontTexture || "./fonts/VT323.png",
    });
    const distance = options.distance || 2;
    panel.position.set(0, 0, -distance);
    panel.visible = false;
    this.camera.add(panel);
    return panel;
  }

  // ----------------------------
  // Start Game Panel
  // ----------------------------
  createStartGamePanel() {
    // Create a full-screen panel with a puke green background.
    const panel = this._createPanel({
      fullScreen: true,
      distance: 2,
      backgroundColor: 0x7fff00, // Puke green
    });

    // Create a vertical container to hold the level box and button.
    const container = new ThreeMeshUI.Block({
      width: panel.width * 0.9,
      height: panel.height * 0.7,
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundOpacity: 0,
    });
    panel.add(container);

    // ----- Level Number Box -----
    const levelBox = new ThreeMeshUI.Block({
      width: 0.8,
      height: 0.15,
      margin: 0.02,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: new THREE.Color(0x1f1f1f),
      borderRadius: 0.03,
    });
    const levelText = new ThreeMeshUI.Text({
      content: `LEVEL NUMBER: ${window.level}`,
      fontSize: 0.06,
      textColor: new THREE.Color(0xffffff),
    });
    levelBox.add(levelText);
    container.add(levelBox);

    // ----- Start Game Button -----
    const startButton = new ThreeMeshUI.Block({
      width: 0.8,
      height: 0.2,
      margin: 0.02,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: new THREE.Color(0x1f8b4c),
      borderRadius: 0.05,
    });
    const startText = new ThreeMeshUI.Text({
      content: "Start Level",
      fontSize: 0.08,
      textColor: new THREE.Color(0xffffff),
    });
    startButton.add(startText);
    container.add(startButton);

    // Setup button states for Start Game.
    startButton.setupState({
      state: "idle",
      attributes: { offset: 0.02, backgroundColor: new THREE.Color(0x1f8b4c) },
    });
    startButton.setupState({
      state: "hovered",
      onSet: () => startButton.set({ backgroundColor: new THREE.Color(0x3fa65e) }),
    });
    startButton.setupState({
      state: "active",
      onSet: () => {
        startButton.set({ backgroundColor: new THREE.Color(0x75c882) });
        this.hidePanel("start");
        if (this.guiPanels.start && this.guiPanels.start.onStart) {
          this.guiPanels.start.onStart();
        }
      },
    });

    this.guiPanels.start = {
      panel,
      interactables: [startButton],
      onStart: null, // Callback for starting the game.
      levelText,
    };
  }

  // ----------------------------
  // Panel Controls
  // ----------------------------
  showPanel(key, onActionCallback = null) {
    if (key !== "settings" && this.activePanel) {
      this.activePanel.panel.visible = false;
    }
    if (this.guiPanels[key]) {
      // Update level text if showing start
      if (key === "start" && this.guiPanels.start.levelText) {
        this.guiPanels.start.levelText.set({ content: `LEVEL NUMBER: ${window.level}` });
      }
      this.guiPanels[key].panel.visible = true;
      if (onActionCallback) {
        if (key === "start") {
          this.guiPanels.start.onStart = onActionCallback;
        } else if (key === "pause") {
          this.guiPanels.pause.onResume = onActionCallback;
        }
      }
      this.activePanel = this.guiPanels[key];
    }
  }

  hidePanel(key, restorePrevious = false) {
    if (this.guiPanels[key]) {
      this.guiPanels[key].panel.visible = false;
      if (this.activePanel === this.guiPanels[key]) {
        this.activePanel = null;
      }
      if (key === "settings" && restorePrevious && this.previousPanel) {
        this.previousPanel.panel.visible = true;
        this.activePanel = this.previousPanel;
        this.previousPanel = null;
      }
    }
  }

  hideAll() {
    for (const key in this.guiPanels) {
      this.guiPanels[key].panel.visible = false;
    }
    this.activePanel = null;
  }

  update() {
    if (!this.activePanel || !this.activePanel.panel.visible) return;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    for (const obj of this.activePanel.interactables) {
      const intersect = this.raycaster.intersectObject(obj, true);
      if (intersect.length > 0) {
        obj.setState("hovered");
      } else {
        obj.setState("idle");
      }
    }
    ThreeMeshUI.update();
  }

  _onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  _onClick() {
    if (!this.activePanel) return;
    for (const obj of this.activePanel.interactables) {
      const intersect = this.raycaster.intersectObject(obj, true);
      if (intersect.length > 0) {
        if (typeof obj.userData.onClick === "function") {
          obj.userData.onClick();
        } else {
          obj.setState("active");
        }
      }
    }
  }

  _onKeyDown(event) {
    if (this.waitingForKey) {
      const newKey = event.key.toUpperCase();
      this.controlBindings[this.waitingForKey] = newKey;
      if (
        this.guiPanels.settings &&
        this.guiPanels.settings.keyButtons &&
        this.guiPanels.settings.keyButtons[this.waitingForKey]
      ) {
        this.guiPanels.settings.keyButtons[this.waitingForKey].set({
          content: newKey,
        });
      }
      this.saveControls();
      this.waitingForKey = null;
    }
  }

  async saveControls() {
    try {
      const response = await fetch("/json/controls.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.controlBindings),
      });
      if (!response.ok) throw new Error("Failed to save controls.");
      console.log("Updated Controls:", this.controlBindings);
    } catch (error) {
      console.error("Error saving controls:", error);
    }
  }
}