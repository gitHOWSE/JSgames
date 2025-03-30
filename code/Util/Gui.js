// Util/Gui.js
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { scene } from "./Camera.js"; // Attach panels to the scene.

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

  // Save updated controls to the JSON file via a PUT request.
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
    // Instead of attaching to the camera, attach the panel to the scene.
    scene.add(panel);
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
      backgroundColor: 0x7fff00, // Puke green background
    });

    // Create a vertical container to hold the buttons.
    const container = new ThreeMeshUI.Block({
      width: panel.width * 0.9,
      height: panel.height * 0.7,
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundOpacity: 0,
    });
    panel.add(container);

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
      content: "Start Game",
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
      onSet: () =>
        startButton.set({ backgroundColor: new THREE.Color(0x3fa65e) }),
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

    // ----- Settings Button -----
    const settingsButton = new ThreeMeshUI.Block({
      width: 0.8,
      height: 0.2,
      margin: 0.02,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: new THREE.Color(0x1f8b4c),
      borderRadius: 0.05,
    });
    const settingsText = new ThreeMeshUI.Text({
      content: "Settings",
      fontSize: 0.08,
      textColor: new THREE.Color(0xffffff),
    });
    settingsButton.add(settingsText);
    container.add(settingsButton);

    // Setup button states for Settings.
    settingsButton.setupState({
      state: "idle",
      attributes: { offset: 0.02, backgroundColor: new THREE.Color(0x1f8b4c) },
    });
    settingsButton.setupState({
      state: "hovered",
      onSet: () =>
        settingsButton.set({ backgroundColor: new THREE.Color(0x3fa65e) }),
    });
    settingsButton.setupState({
      state: "active",
      onSet: () => {
        settingsButton.set({ backgroundColor: new THREE.Color(0x75c882) });
        // Store the current panel to restore later if needed.
        if (this.activePanel && this.activePanel !== this.guiPanels.settings) {
          this.previousPanel = this.activePanel;
        }
        this.showPanel("settings");
      },
    });

    // Save the start panel information.
    this.guiPanels.start = {
      panel,
      interactables: [startButton, settingsButton],
      onStart: null, // Callback for starting the game.
    };
  }

  // ----------------------------
  // Pause Panel
  // ----------------------------
  createPausePanel() {
    const panel = this._createPanel({
      fullScreen: true,
      distance: 2,
      backgroundColor: 0x222222,
    });

    const container = new ThreeMeshUI.Block({
      width: panel.width * 0.9,
      height: panel.height * 0.7,
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundOpacity: 0,
    });
    panel.add(container);

    // Create the "Resume" button.
    const resumeButton = new ThreeMeshUI.Block({
      width: 0.8,
      height: 0.2,
      margin: 0.02,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: new THREE.Color(0x1f8b4c),
      borderRadius: 0.05,
    });
    const resumeText = new ThreeMeshUI.Text({
      content: "Resume",
      fontSize: 0.08,
      textColor: new THREE.Color(0xffffff),
    });
    resumeButton.add(resumeText);
    container.add(resumeButton);
    resumeButton.setupState({
      state: "idle",
      attributes: { offset: 0.02, backgroundColor: new THREE.Color(0x1f8b4c) },
    });
    resumeButton.setupState({
      state: "hovered",
      onSet: () =>
        resumeButton.set({ backgroundColor: new THREE.Color(0x3fa65e) }),
    });
    resumeButton.setupState({
      state: "active",
      onSet: () => {
        resumeButton.set({ backgroundColor: new THREE.Color(0x75c882) });
        this.hidePanel("pause");
        if (this.guiPanels.pause && this.guiPanels.pause.onResume) {
          this.guiPanels.pause.onResume();
        }
      },
    });

    // Create the "Settings" button.
    const settingsButton = new ThreeMeshUI.Block({
      width: 0.8,
      height: 0.2,
      margin: 0.02,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: new THREE.Color(0x1f8b4c),
      borderRadius: 0.05,
    });
    const settingsText = new ThreeMeshUI.Text({
      content: "Settings",
      fontSize: 0.08,
      textColor: new THREE.Color(0xffffff),
    });
    settingsButton.add(settingsText);
    container.add(settingsButton);
    settingsButton.setupState({
      state: "idle",
      attributes: { offset: 0.02, backgroundColor: new THREE.Color(0x1f8b4c) },
    });
    settingsButton.setupState({
      state: "hovered",
      onSet: () =>
        settingsButton.set({ backgroundColor: new THREE.Color(0x3fa65e) }),
    });
    settingsButton.setupState({
      state: "active",
      onSet: () => {
        settingsButton.set({ backgroundColor: new THREE.Color(0x75c882) });
        if (this.activePanel && this.activePanel !== this.guiPanels.settings) {
          this.previousPanel = this.activePanel;
        }
        this.showPanel("settings");
      },
    });

    this.guiPanels.pause = {
      panel,
      interactables: [resumeButton, settingsButton],
      onResume: null, // Callback for resuming the game.
    };
  }

  // ----------------------------
  // Settings Panel
  // ----------------------------
  createSettingsPanel() {
    // Create a full-screen panel with a solid background.
    const panel = this._createPanel({
      fullScreen: true,
      distance: 1.8,
      backgroundColor: 0x000000,
    });

    // Create a title text.
    const title = new ThreeMeshUI.Text({
      content: "Settings - Key Bindings",
      fontSize: 0.08,
      textColor: new THREE.Color(0xffffff),
    });
    panel.add(title);

    // Create a vertical container for the key binding buttons.
    const buttonContainer = new ThreeMeshUI.Block({
      width: panel.width * 0.9,
      height: panel.height * 0.7,
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: new THREE.Color(0x000000),
      backgroundOpacity: 1,
      padding: 0.02,
    });
    panel.add(buttonContainer);

    const keyButtons = {};
    const interactables = [];

    // Create a button for each control binding.
    for (const control in this.controlBindings) {
      const keyButton = new ThreeMeshUI.Block({
        width: 0.4,
        height: 0.1,
        margin: 0.01,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: new THREE.Color(0x1f8b4c),
        borderRadius: 0.03,
      });
      const keyText = new ThreeMeshUI.Text({
        content: this.controlBindings[control],
        fontSize: 0.06,
        textColor: new THREE.Color(0xffffff),
      });
      keyButton.add(keyText);
      buttonContainer.add(keyButton);

      // Set onClick handler to allow key reassignment.
      keyButton.userData.onClick = () => {
        this.waitingForKey = control;
        keyText.set({ content: "Press Key" });
      };

      keyButtons[control] = keyText;
      interactables.push(keyButton);
    }

    // Create an Exit button for the settings panel.
    const exitButton = new ThreeMeshUI.Block({
      width: 0.4,
      height: 0.12,
      margin: 0.02,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: new THREE.Color(0x1f8b4c),
      borderRadius: 0.03,
    });
    const exitText = new ThreeMeshUI.Text({
      content: "Exit",
      fontSize: 0.06,
      textColor: new THREE.Color(0x8a2be2),
    });
    exitButton.add(exitText);
    panel.add(exitButton);
    exitButton.position.set(-panel.width / 2 + 0.3, -panel.height / 2 + 0.1, 0);
    exitButton.setupState({
      state: "idle",
      attributes: { offset: 0.02, backgroundColor: new THREE.Color(0x1f8b4c) },
    });
    exitButton.setupState({
      state: "hovered",
      onSet: () =>
        exitButton.set({ backgroundColor: new THREE.Color(0x3fa65e) }),
    });
    exitButton.userData.onClick = () => {
      this.saveControls();
      this.hidePanel("settings", true);
    };
    interactables.push(exitButton);

    this.guiPanels.settings = {
      panel,
      interactables,
      keyButtons,
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

  // ----------------------------
  // Update and Event Handlers
  // ----------------------------
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
}
