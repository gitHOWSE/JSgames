// player/stats.js
//JAMES: Manages the player’s HP and RAM stats, and pushes them to the HUD.

import { hudManager } from "../Util/Hud.js";

//JAMES: RAM pool persists across hacks—start at 4096.
export let ram = 4096;

/**
 * JAMES: Increase the RAM pool by `amount`.
 * @param {number} amount
 */
export function increaseRam(amount) {
  ram += amount;
}

/**
 * JAMES: Decrease the RAM pool by `amount`, never dropping below zero.
 * @param {number} amount
 */
export function decreaseRam(amount) {
  ram = Math.max(0, ram - amount);
}

/**
 * JAMES: Call this once per frame (e.g. from your level’s animate()).
 *        It reads the player’s HP and maxHP, then updates the HUD:
 *        - “battery” bar shows HP
 *        - “RAM” panel shows the current RAM pool
 */
export function updateStats() {
  if (!window.player) return;

  //JAMES: Pull current HP and maxHP from the active entity
  const currentHp = window.player.getHealth();
  const maxHp = window.player.getMaxHealth();

  //JAMES: Feed HP into the HUD’s battery slot, RAM into its RAM slot
  hudManager.updateHUD(
    /* batteryCurrent = */ currentHp,
    /* batteryMax     = */ maxHp,
    /* ramValue       = */ ram,
  );
}
