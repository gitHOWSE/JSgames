// src/robots/endLevelTerminal.js
import * as THREE from "three";
import { OnwallLow } from "../explosives/onwall.js";
import { cameraManager } from "../Util/Camera.js";

// JAMES: A special terminal that ends the level when hacked.
export class EndLevelTerminal extends OnwallLow {
  constructor(position) {
    // use the low‑poly access terminal you configured in onwall.js
    super("accessTerminalLow", position, cameraManager.scene);

    this.tag = "endLevelTerminal";
    this.nextLevel = window.level +1;
  }

  onHacked() {
    // Advance the level
    window.level = this.nextLevel;
    console.log(`Advancing to level ${window.level}`);
  
    // Persist it to sessionStorage
    sessionStorage.setItem("level", window.level);
  
    // Reload the page
    window.location.reload();
  }
  
}

/** convenience spawner */
export function spawnEndLevelTerminal(position) {
  return new EndLevelTerminal(position);
}
