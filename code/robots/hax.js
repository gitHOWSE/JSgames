// robots/hax.js
"use strict";

import * as THREE from "three";
import entityManager from "../entities/EntityManager.js";

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
    return; // Cooldown not finished.
  }

  if (!window.controller) {
    console.log("//JAMES: Controller not found");
    return;
  }

  if (!window.controller.isControlActive("action1")) {
    return; // Hack key not active.
  }

  //JAMES: Log all entities for debugging.
  logEntityPositions();

  const entities = entityManager.getEntities();
  console.log(`//JAMES: Checking hacks; ${entities.length} entities found`);

  for (let target of entities) {
    if (target.id === playerEntity.id) continue;

    if (!target.getHackable()) {
      console.log(`//JAMES: Entity ${target.id} is not hackable`);
      continue;
    }

    target.updateBoundingBox();
    const targetCenter = new THREE.Vector3();
    target.boundingBox.getCenter(targetCenter);
    const distance = playerEntity.position.distanceTo(targetCenter);

    //JAMES: Compute target radius using bounding box dimensions.
    const size = new THREE.Vector3();
    target.boundingBox.getSize(size);
    const radius = 0.5 * Math.max(size.x, size.y, size.z);
    const effectiveDistance = distance - radius;

    console.log(
      `//JAMES: Target ${target.id}: distance = ${distance.toFixed(2)}, radius = ${radius.toFixed(2)}, effectiveDistance = ${effectiveDistance.toFixed(2)}`,
    );

    //JAMES: For testing, using effectiveDistance < 100.
    if (effectiveDistance < 3) {
      playerEntity.lastHackTime = now;
      window.hackDisabledUntil = now + 3000;
      if (target.is_robot) {
        console.log(`//JAMES: Robot entity ${target.id} hacked.`);
        const previous = playerEntity;
        previous.isFrozen = true;
        previous.movement.velocity.set(0, 0, 0);
        previous.movement.acceleration.set(0, 0, 0);
        setTimeout(() => playerEntity.setHackable(), 1000);
        setTimeout(() => {
          previous.isFrozen = false;
        }, 10000);
        playerEntity.unMakePlayer();
        target.makePlayer();
        target.movement.velocity.set(0, 0, 0);
      } else {
        console.log(
          `//JAMES: Non-robot entity ${target.id} hacked (disabled).`,
        );
        target.isFrozen = true;
        target.movement.velocity.set(0, 0, 0);
        target.movement.acceleration.set(0, 0, 0);
        setTimeout(() => {
          target.isFrozen = false;
        }, 10000);
      }

      break; //JAMES: Hack only one entity per key press.
    }
  }
}
