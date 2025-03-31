export class Controller {
  constructor() {
    this.controls = {};
    this.loadControls();
    this.activeKeys = {};
  }

  async loadControls() {
    try {
      const response = await fetch("/json/controls.json");
      if (!response.ok) {
        throw new Error("Failed to load controls.json");
      }
      this.controls = await response.json();
      console.log("Controls loaded:", this.controls);
      this.listen();
    } catch (error) {
      console.error("Error loading controls:", error);
    }
  }

  handleKeyDown(event) {
    const pressedKey = event.key;
    this.activeKeys[pressedKey.toLowerCase()] = true;
    for (const action in this.controls) {
      const controlKey = this.controls[action];
      if (pressedKey.toLowerCase() === controlKey.toLowerCase()) {
        console.log(`Control pressed: ${action} (Key: ${pressedKey})`);
      }
    }
  }

  handleKeyUp(event) {
    const releasedKey = event.key;
    delete this.activeKeys[releasedKey.toLowerCase()];
    for (const action in this.controls) {
      const controlKey = this.controls[action];
      if (releasedKey.toLowerCase() === controlKey.toLowerCase()) {
        console.log(`Control released: ${action} (Key: ${releasedKey})`);
      }
    }
  }

  listen() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }
}
