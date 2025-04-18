// JAMES: TeamColour.js — central palette for every render‑side tint.
export const TeamColour = Object.freeze({
    player : 0x44a2ff,   // JAMES: Bright blue   // summary: player tint.
    enemy  : 0xff5555,   // JAMES: Danger red    // summary: enemy tint.
    neutral: 0x999999,   // JAMES: Grey props    // summary: neutral tint.
  });
  


/**
 * applyHeadlightTint(entity)
 * --------------------------------------------------------------
 * Makes sure the entity has lights and tints them to match the
 * current team colour.  Intensity has been boosted.             // summary
 */
export function applyHeadlightTint(entity) {
    const tint = TeamColour[entity.getTeam?.()] || 0xffffff;   // JAMES: lookup
  
    // JAMES: Add lights on demand (now brighter)
    if (!entity.headlight && entity.enableHeadlights) {

      entity.enableHeadlights(tint, 120, 40);     // JAMES: spot light
    }
    if (!entity.bulb && entity.enableBulbLight) {

      entity.enableBulbLight(tint, 20, 18);       // JAMES: point glow
    }
  
    // JAMES: Update existing lights
    if (entity.headlight) entity.headlight.color.setHex(tint);
    if (entity.bulb)      entity.bulb.color.setHex(tint);
  }