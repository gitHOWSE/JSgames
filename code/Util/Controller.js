class Controller {
  constructor() {
    this.controls = {};
    this.loadControls();
    this.activeKeys = {};
  }

  //JAMES: Load the controls from json.
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

  //JAMES: When a key is pushed down add it to active keys.
  handleKeyDown(event) {
    const pressedKey = event.key;
    this.activeKeys[pressedKey.toLowerCase()] = true;
    for (const action in this.controls) {
      const controlKey = this.controls[action];
      if (pressedKey.toLowerCase() === controlKey.toLowerCase()) {
        //console.log(`Control pressed: ${action} (Key: ${pressedKey})`);
      }
    }
  }

  //JAMES: When a key is not pressed anymore, remove it from active keys.
  handleKeyUp(event) {
    const releasedKey = event.key;
    delete this.activeKeys[releasedKey.toLowerCase()];
    for (const action in this.controls) {
      const controlKey = this.controls[action];
      if (releasedKey.toLowerCase() === controlKey.toLowerCase()) {
        //console.log(`Control released: ${action} (Key: ${releasedKey})`);
      }
    }
  }

  //JAMES: Gracefully listens for when something happens to a key.
  listen() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  //JAMES: Adds ability to check if a control varname is active.
  isControlActive(controlName) {
    const key = this.controls[controlName];
    if (!key) return false;
    return !!this.activeKeys[key.toLowerCase()];
  }
}

export const controller = new Controller();
