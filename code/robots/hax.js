// robots/hax.js
"use strict";

import * as THREE from "three";
import entityManager from "../entities/EntityManager.js";
import { switchTeam, Teams } from "../entities/Team.js";

//JAMES: Debug function to log all entities' id, position, and hackable flag.
function logEntityPositions() {
  const entities = entityManager.getEntities();
  entities.forEach((ent) => {
    console.log(
      `//JAMES: Entity ${ent.id} position: (${ent.position.x.toFixed(2)}, ${ent.position.y.toFixed(2)}, ${ent.position.z.toFixed(2)}), hackable: ${ent.getHackable()}`,
    );
  });
}

//JAMES: Checks if the hack key ("action1") is pressed and if a hackable entity is within range.
//JAMES: Implements a 5-second debounce to prevent repeated hacks.
export default function checkHacks(playerEntity) {
  const now = Date.now();

  if (window.hackDisabledUntil && now < window.hackDisabledUntil) {
    return;
  }

  if (!playerEntity.lastHackTime) {
    playerEntity.lastHackTime = 0;
  }
  if (now - playerEntity.lastHackTime < 5000) {
    console.log("//JAMES: Hack cooldown active");
    return; 
  }

  if (!window.controller) {
    console.log("//JAMES: Controller not found");
    return;
  }

  if (!window.controller.isControlActive("action1")) {
    
    return; 
  }
console.log(`//JAMES: Hack called by player ${playerEntity.id}, ${playerEntity.position.x.toFixed(2)}, ${playerEntity.position.y.toFixed(2)}, ${playerEntity.position.z.toFixed(2)}`);
  logEntityPositions();

  const entities = entityManager.getEntities();
  console.log(`//JAMES: Checking hacks; ${entities.length} entities found`);

  for (let target of entities) {
    if (target.id === playerEntity.id || target=== window.player) continue;

    if (!target.getHackable()) {
      console.log(`//JAMES: Entity ${target.id} is not hackable`);
      continue;
    }

    const targetCenter = target.position.clone();
    const distance = playerEntity.position.distanceTo(targetCenter);
    const radius = 1;              
    const effectiveDistance = distance - radius;

    console.log(
      `//JAMES: Target ${target.id}: distance = ${distance.toFixed(2)}, radius = ${radius.toFixed(2)}, effectiveDistance = ${effectiveDistance.toFixed(2)}`,
    );
//&& target.getArmor() <= 0
    //JAMES: For testing, using effectiveDistance < 100 ish.
    if (effectiveDistance < 6 ) {
      playerEntity.lastHackTime = now;
      window.hackDisabledUntil = now + 3000;
      if (target.is_robot) {
        console.log(`//JAMES: Robot ${playerEntity} entity hacked ${target.id}.`);
        const previous = playerEntity;
        previous.isFrozen = true;
        target.setTeam("player")
        previous.movement.velocity.set(0, 0, 0);
        previous.movement.acceleration.set(0, 0, 0);
        setTimeout(() => playerEntity.setHackable(), 1000);
        setTimeout(() => {
          previous.isFrozen = false;
        }, 5000);
        playerEntity.unMakePlayer();
        target.makePlayer();
        if (target.carryTurret) {
          target.carryTurret.setTeam("player");
          target.carryTurret.lampsOn = false; // JAMES: Force light refresh
        }


        target.movement.velocity.set(0, 0, 0);
      } else {
        console.log(
          `//JAMES: Non-robot entity ${target.id} hacked (disabled).`,
        );
        target.isFrozen = true;
        target.setTeam("player");
        target.movement.velocity.set(0, 0, 0);
        target.movement.acceleration.set(0, 0, 0);
        setTimeout(() => {
          target.isFrozen = false;
        }, 5000);
      }

      break; //JAMES: Hack only one entity per key press.
    }
  }
}
