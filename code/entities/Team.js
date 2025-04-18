// entities/Teams.js — single source of truth for allegiance.

export const Teams = Object.freeze({
    player : "player",   // JAMES: Any entity currently controlled by the user.
    enemy  : "enemy",    // JAMES: Hostile AI units by default.
    neutral: "neutral",  // JAMES: Scenery, terminals, props, civilians.
  });
  
  /** isHostileTo(a,b) – true ⇢ entities on different teams AND both movable. */
  export function isHostileTo(a, b) {
    if (!a || !b)                         return false;        // JAMES: null‑guard.
    if (a.is_stationary_electronic || b.is_stationary_electronic) return false;
    return a.getTeam() !== b.getTeam();
  }


  // JAMES: switchTeam(current, [override])
// ————————————————————————————————————————
// Flips to the opposite side (enemy<->player) by default.
// If override is a valid Teams key, returns that instead.
export function switchTeam(current, override) {
  if (override && Teams[override]) {
    return Teams[override];                      // JAMES: forced side
  }
  return current === Teams.enemy
    ? Teams.player                              // JAMES: enemy->player
    : Teams.enemy;                              // JAMES: player->enemy
}