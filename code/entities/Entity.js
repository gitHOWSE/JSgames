// entities/Entity.js
//TODO CLEAN UP DUPLICATES


import * as THREE from "three";
import { Movement } from "./Movement.js";
import { Item } from "./Items.js";
import checkHacks from "../robots/hax.js";
import { WanderBehaviour } from "../robots/behaviours.js";
import { switchTeam, Teams, isHostileTo } from "./Team.js";
import { applyHeadlightTint, TeamColour } from "../Util/HeadlightTint.js";
export class Entity {
  static nextId = 0;

  constructor(params = {}) {
    //JAMES: Assign a unique ID
    this.id = Entity.nextId++;
/* ---------- allegiance & armour ---------- */
this.team      = params.team || Teams.enemy;  // JAMES: default side.
this.max_armor = params.max_armor ?? 50;      // JAMES: hack gate.
this.armor     = this.max_armor;              // JAMES: current armour.



    //JAMES: Tag & basic stats
    this.tag = params.tag || "default";
    this.max_health = params.max_health ?? 1;
    this.health = this.max_health;
    this.max_charge = params.max_charge ?? 60;
    this.charge = this.max_charge;
    this.isFrozen = false;

    //JAMES: Position vectors
    this.position = params.position?.clone() || new THREE.Vector3();
    this.prevPosition = this.position.clone();

    //JAMES: Movement and carried item
    this.isCollided = false;
    this.isMovable = true;
    this.movement = params.movement || new Movement();
    this.item = params.item || new Item();
    this.has_legs = false;

    //JAMES: The root Group for all visuals of this entity
    this.model = params.model || new THREE.Group();
    if (params.scene) {
      params.scene.add(this.model);
    }

    //JAMES: If a mesh was provided, parent it under  model
    this.mesh = params.mesh || null;
    if (this.mesh) {
      this.model.add(this.mesh);
    }
    if (params.autoLights !== false && this.mesh) {           // JAMES: default ON.
      const tint = TeamColour[this.team];                     // JAMES: side colour.
      this.enableHeadlights(tint, 60, 25);                    // JAMES: spot‑light.
      this.enableBulbLight?.(tint, 8, 12);                    // JAMES: point‑glow.
    }
    
    
    //JAMES: Track previous quaternion on the model for delta‑rotation
    this.prevQuaternion = this.model.quaternion.clone();

    //JAMES: Headlight & glow placeholders
    this.headlight = null;
    this.bulb = null;

    //JAMES: Bounding box for collisions, visibility, etc.
    this.boundingBox = new THREE.Box3();
    if (params.showBB && params.scene) {
      this.bbHelper = new THREE.Box3Helper(this.boundingBox, 0xff0000);
      params.scene.add(this.bbHelper);
    }

    //JAMES: Player‑controlled flag
    this.is_robot = false;
    this.is_stationary_electronic = false;

    //JAMES: Drone-Related
    this.canFly = false;

  }

  getWorldPosition(target = window.origin) {
    return this.model.getWorldPosition(target);
  }


  getPositionRelativeTo(referenceObj, out = new THREE.Vector3()) {
    // ensure world matrices are current
    if (this.model.parent) this.model.parent.updateMatrixWorld(true);

    // 1. write our world position into out
    this.model.getWorldPosition(out);
    // 2. convert into referenceObj’s local space
    return referenceObj.worldToLocal(out);
  }

  //JAMES: Returns the world forward direction vector.
  getForwardDirection() {
    const worldQuat = new THREE.Quaternion();
    this.model.getWorldQuaternion(worldQuat);
    return new THREE.Vector3(0, 0, -1).applyQuaternion(worldQuat).normalize();
  }

  //JAMES: Returns the local forward direction vector.
  getLocalForwardDirection() {
    return new THREE.Vector3(0, 0, -1);
  }
  toggleTeam(override) {
    const next = switchTeam(this.team, override);
    this.setTeam(next);
    return next;
  }

disableHeadlights()
{
  this.headlight = null;
}

disableBulbLights()
{
  this.bulb = null;
}

  //JAMES: Enables a SpotLight as headlights.
  enableHeadlights(color = 0xffffff, intensity = 100, distance = 2000) {
    if (!this.mesh) {
      console.warn("Entity has no mesh; cannot attach headlights.");
      return;
    }
    this.headlight = new THREE.SpotLight(color, intensity, distance);
    this.headlight.castShadow = true;
    this.headlight.angle = Math.PI / 7;

    // Position & target
    const forward = this.getLocalForwardDirection();
    this.headlight.position.copy(forward.clone().multiplyScalar(1));
    const target = new THREE.Object3D();
    target.position.copy(forward.clone().multiplyScalar(10).setY(1));
    this.mesh.add(target);
    this.headlight.target = target;
    this.mesh.add(this.headlight);
  }

  //JAMES: Enables a PointLight for glow.
  enableBulbLight(color = 0xffffff, intensity = 10, distance = 15) {
    if (!this.mesh) {
      console.warn("Entity has no mesh; cannot attach bulb light.");
      return;
    }
    this.bulb = new THREE.PointLight(color, intensity, distance);
    this.bulb.position.set(0, 0, 0);
    this.mesh.add(this.bulb);
  }

  //JAMES: Update headlight position & target each frame.
  updateHeadlights() {
    if (!this.headlight) return;
    this.mesh.updateMatrixWorld();
    const forward = this.getLocalForwardDirection();
    this.headlight.position.copy(forward.clone().multiplyScalar(1).setY(2));
    this.headlight.target.position.copy(
      forward.clone().multiplyScalar(10).setY(1),
    );
  }

  //JAMES: Recompute bounding box from the model.
  updateBoundingBox() {
    this.boundingBox.setFromObject(this.model);
    if (this.bbHelper) this.bbHelper.update();
  }

  //JAMES: Centralized per‑frame update.
  update(delta) {
    if (this.isFrozen) {
      // skip all movement, hacking, etc. while frozen
      return;
    }
    if (this === window.player && window.controller && !this.getCollided()) {
      this.movement.updateFromInput(window.controller, this, delta);
      this.movement.updateAngular(delta);
      //console.log("Player position:", this.position);

      //JAMES: Rotate the whole model
      this.model.rotateY(this.movement.angularVelocity * delta);

      //JAMES: Apply that rotation to our velocity vector
      const currentQuat = this.model.quaternion.clone();
      const deltaQuat = currentQuat
        .clone()
        .multiply(this.prevQuaternion.clone().invert());
      this.movement.velocity.applyQuaternion(deltaQuat);
      this.prevQuaternion.copy(currentQuat);
      this.setTeam("player")
      //JAMES: AI wanderers get a steering force but no forward‑snap
    } else if (this.behaviour) {
      const steer = this.behaviour.calculate(delta);
      //JAMES: Clamp steering to maxForce and accumulate
      this.movement.acceleration.add(
        steer.clampLength(0, this.movement.maxForce),
      );
    }
    // JAMES: If this entity is a forklift and has an updateForklift function, call it.
    if (
      this.getTag() === "forklift" &&
      typeof this.updateForklift === "function"
    ) {
      this.updateForklift(delta);
    }
    if (this.mixer) {
      this.mixer.update(delta);
    }

    //JAMES: Friction & linear integration (common to both player & AI)
    this.movement.applyFriction();
    this.movement.applyStaticFriction();

    //JAMES: For AI, passing `null` prevents re‑snapping to forward direction.
    const forwardDir =
      this === window.player ? this.getForwardDirection() : null;
    this.movement.updateLinear(delta, forwardDir);

    //JAMES: Integrate position
    this.position.add(this.movement.velocity.clone().multiplyScalar(delta));
    //JAMES: Clear accumulated acceleration
    this.movement.acceleration.set(0, 0, 0);

    //JAMES: Move the model to our new position
    this.model.position.copy(this.position);

    //JAMES: Lights & camera follow
    this.updateHeadlights();
    if (this === window.player && window.cameraManager) {
      window.cameraManager.followObject(this);
    }

    //JAMES: Check for hacks
    checkHacks(this);
    //JAMES: Update bounding box for collisions/debug
    this.updateBoundingBox();
  }

  //JAMES: Mark/unmark as player
  makePlayer() {
    window.player = this;
    this.setTeam("player");
    console.log(`>> makePlayer(): entity ${this.id} is now window.player`);
  }
  unMakePlayer() {
    if (window.player === this) {
      this.setTeam("enemy");
      console.log(
        `>> unMakePlayer(): entity ${this.id} removed from window.player`,
      );
      window.player = null;
    }
  }
  //JAMES: Accessors


  isStationaryElectronic() {
    return this.is_stationary_electronic;
  }

  setStationaryElectronic(t = true) {
    this.is_stationary_electronic = !!t;
  }


  isFriendly(other) {
    return other.getTeam && other.getTeam() === this.getTeam();
  }

  getFly()
  {
    return this.canFly;
  }
  setFly(t = true) {
    this.canFly = !!t;
  }
  getId() {
    return this.id;
  }
  getTag() {
    return this.tag;
  }
  getCollided() {
    return this.isCollided;
  }
  isRobot() {
    return this.is_robot;
  }
  getTeam() { return this.team; }

  getMaxHealth() {
    return this.max_health;
  }
  getHealth() {
    return this.health;
  }
  getMaxCharge() {
    return this.max_charge;
  }
  getCharge() {
    return this.charge;
  }
  getPos() {
    return this.position;
  }
  getTeam() {
    return this.team;
  }             // JAMES: access.

  isFriendly(other) { return !isHostileTo(this, other); }
  getHackable() {
    return this.is_hackable;
  }
  getMovable() {
    return this.isMovable;
  }
  getLegs() {
    return this.has_legs;
  }
  setHealth(h) {
    this.health = Math.min(this.max_health, h);
  }
  setMovable(t) {
    this.isMovable = t;
  }
  setCollided(t) {
    this.isCollided = t;
  }
  heal(h) {
    this.health = Math.min(this.max_health, this.health + h);
  }
  damage(d) {
    this.health -= d;
  }
  setHackable(t = true) {
    this.is_hackable = t || true;
  }
  setRobot() {
    this.is_robot = true;
  }
  setLegs(t) {
    if (t === true) {
      this.has_legs = true;
    } else {
      this.has_legs = false;
    }
  }
  /* =======================================================================
   TEAM & DURABILITY HELPERS
 ======================================================================= */

// JAMES: Get current allegiance.
getTeam() { return this.team; }  // JAMES: accessor.

// JAMES: Change side and retint lights.
setTeam(t) {                     // JAMES: mutate + tint.
  this.team = t in Teams ? t : Teams.enemy;  // JAMES: validate.
  applyHeadlightTint(this);                  // JAMES: recolour.
}

// JAMES: Are we on the same team?  (Immovables are never hostile.)
isFriendly(other) { return !isHostileTo(this, other); }  // JAMES: compare.

/* ---------- armour ---------- */
getArmor()    { return this.armor; }          // JAMES: accessor.
getMaxArmor() { return this.max_armor; }      // JAMES: accessor.

/** takeDamage() — armour first, spill hits health. */
takeDamage(damage, pierce = false) {          // JAMES: mutator.
  if (pierce || this.armor <= 0) {
    this.health -= damage;                    // JAMES: direct bleed.
  } else {
    const spill = Math.max(0, damage - this.armor); // JAMES: overflow.
    this.armor  = Math.max(0, this.armor - damage); // JAMES: deplete.
    this.health -= spill;                     // JAMES: residual.
    if (this.armor === 0) {
      /* JAMES: armour broken — SFX/flash hook here. */
    }
  }
}

}
