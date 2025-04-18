import * as THREE from "three";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { raycast } from "../Util/raycast.js";
import { Projectile } from "./projectiles.js";
import { BaseState } from "./states.js";
import { controller } from "../Util/Controller.js";
import { Vector3 } from "three/webgpu";
import { cameraManager } from "../Util/Camera.js";
import { TeamColour } from "../Util/HeadlightTint.js";
import { findVisibleTarget } from "../Util/raycast.js";

const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();   // LOS target pos


// JAMES: Turret entity
export class Turret extends Entity {
  constructor({ scene, position, host = null, tag = "turret" } = {}) {
    super({ scene, position, tag });

    this.team = this.team || "enemy";   // default for stand‑alone turrets

    this.setStationaryElectronic(true);
    this.host            = host;
    this.setHackable(true);
    this.fireCooldown  = 0.35;   // seconds between shots
this.cooldownTimer = 0;

    this.fireCooldown       = 3.5;
    this.cooldownTimer      = 0;
    this.projectileSpeed    = 75;
    this.fireAngleThreshold = THREE.MathUtils.degToRad(5);
    this.currentTarget = null;
    // create yaw & pitch pivots
    this.yawPivot   = new THREE.Object3D();
    this.pitchPivot = new THREE.Object3D();
    this.yawPivot.position.set(4, 0, 4);
    this.pitchPivot.position.set(0, 1.5, 0);
    this.yawPivot.add(this.pitchPivot);
    this.model.add(this.yawPivot);

    this.originDummy = new THREE.Object3D();
    this.originDummy.position.set(0, 0, 0);


    // muzzle helper
    this.muzzle = new THREE.Object3D();
    this.muzzle.position.set(0, 0, 1.2);
    this.pitchPivot.add(this.muzzle);


    // offset logging
    this._offsetLog = [];

    assetLoader.load("turret", "/models/robots/turret.glb")
      .then(mesh => {
        this.mesh = mesh;
        mesh.rotation.y = -Math.PI / 2;
        this.pitchPivot.add(mesh);
        console.log(`//JAMES: Turret ${this.id} mesh loaded`);
      })
      .catch(err => console.error(`//JAMES: Turret ${this.id} mesh failed to load`, err));
this.lampsOn = false;
    
      
      
  }

  // JAMES: Scan and engage — one universal behavior for all turrets.
scanAndFireAtEnemies(delta, hostileTeam = "player") {// JAMES: If already locked on, validate target.
  if (this.targetEnt) {
    const origin = this.muzzle.getWorldPosition(new THREE.Vector3());
    const targetPos = this.targetEnt.getWorldPosition(new THREE.Vector3());
    const forward = new THREE.Vector3(0, 0, 1)
      .applyQuaternion(this.yawPivot.getWorldQuaternion(new THREE.Quaternion()))
      .applyQuaternion(this.pitchPivot.getWorldQuaternion(new THREE.Quaternion()))
      .normalize();
  
    if (
      this.targetEnt.getTeam?.() !== hostileTeam ||
      !raycast(origin, targetPos)
    ) {
      // JAMES: Lost sight or switched sides — forget target.
      this.targetEnt = null;
      console.log(`//JAMES: Turret ${this.id} lost target.`);
    }
  }
  
  // JAMES: Try to reacquire if no valid lock.
  if (!this.targetEnt) {
    const origin = this.muzzle.getWorldPosition(new THREE.Vector3());
    const forward = new THREE.Vector3(0, 0, 1)
      .applyQuaternion(this.yawPivot.getWorldQuaternion(new THREE.Quaternion()))
      .applyQuaternion(this.pitchPivot.getWorldQuaternion(new THREE.Quaternion()))
      .normalize();
  
    const newTarget = findVisibleTarget(
      origin,
      forward,
      360,
      e => e.getTeam && e.getTeam() === hostileTeam
    );
  
    if (newTarget) {
      this.targetEnt = newTarget;
     // console.log(`//JAMES: Turret ${this.id} locked onto Entity ${newTarget.id}.`);
    }
  }
  
  // JAMES: Engage target if locked
  if (this.targetEnt) {
    const targetPos = this.targetEnt.getWorldPosition(new THREE.Vector3());
    this.aimAt(
      targetPos, delta,
      10, 10,
      THREE.MathUtils.degToRad(20),
      THREE.MathUtils.degToRad(90)
    );
  
    if (this.cooldownTimer <= 0 && raycast(origin.position, targetPos)) {
      this.fire();
      this.cooldownTimer = this.fireCooldown;
    }
  } else {
    // JAMES: No target — idle motion.
    this.yawPivot.rotation.y += THREE.MathUtils.degToRad(10) * delta;
    this.pitchPivot.rotation.x += Math.sin(performance.now() * 0.001) * 0.005;
  }
}



  // smoothly aim
  aimAt(target, delta, yawSpeed, pitchSpeed, maxDown, maxUp) {
    const localPos = this.yawPivot.worldToLocal(target.clone());
    // yaw
    const yaw      = Math.atan2(localPos.x, localPos.z);
    const yawDelta = THREE.MathUtils.clamp(yaw, -yawSpeed * delta, yawSpeed * delta);
    this.yawPivot.rotation.y += yawDelta;

    // pitch
    const pitch      = Math.atan2(-localPos.y, Math.hypot(localPos.x, localPos.z));
    const clamped    = THREE.MathUtils.clamp(pitch, -maxDown, maxUp);
    const pitchDelta = THREE.MathUtils.clamp(
      clamped - this.pitchPivot.rotation.x,
      -pitchSpeed * delta,
      pitchSpeed * delta
    );
    this.pitchPivot.rotation.x += pitchDelta;
  }
  update(delta) {
    // JAMES: Turn on lamps once.
    if (this.mesh && !this.lampsOn) {
      const tint = TeamColour[this.team];
      this.enableHeadlights(tint, 60, 25);
      this.enableBulbLight?.(tint, 8, 12);
      this.lampsOn = true;
    }
  
    // JAMES: Mounted turrets behave like their host.
    if (this.host) {
      const hostile = this.host.getTeam?.() === "player" ? "enemy" : "player";
      this.scanAndFireAtEnemies(delta, hostile);
  
      // Manual control option.
      if (
        window.player === this.host &&
        controller.isControlActive("action2") &&
        this.cooldownTimer <= 0
      ) {
        this.fire();
        this.cooldownTimer = this.fireCooldown;
      }
  
    } else {
      // JAMES: Unmanned turret — scan and fire autonomously.
      const hostile = this.getTeam?.() === "player" ? "enemy" : "player";
      this.scanAndFireAtEnemies(delta, hostile);
    }
  
    this.cooldownTimer = Math.max(0, this.cooldownTimer - delta);
    super.update(delta);
  }
  


  findNearestEnemy(origin) {
    let best = null;
    let bestD = Infinity;

    for (const e of entityManager.getEntities()) {
      if (e === this || e === this.host) continue;               // skip self & dog
      if (e.getTeam && e.getTeam() === this.getTeam()) continue;
      if (!e.is_robot && !e.is_stationary_electronic) continue;  // wrong type

      const pos = e.getWorldPosition(_v1);
      if (!raycast(origin, pos)) continue;                       // wall in way

      const d = origin.distanceTo(pos);
      if (d < bestD) { bestD = d; best = e; }
    }
    return best;
  }

  fire() {
    // start cooldown
    this.cooldownTimer = this.fireCooldown;

    // guarantee world matrices are current
    this.model.parent.updateMatrixWorld(true);

    /* -----------------------------------------------------------
     * 1.  World‑space spawn point  = muzzle tip
     * 2.  World‑space forward dir  = yaw ⊕ pitch applied to +Z
     * ----------------------------------------------------------- */
    const spawnWorld = this.muzzle.getWorldPosition(new THREE.Vector3());

  /* -- precise forward dir (+Z through muzzle quaternion) ---- */
  const forward = new THREE.Vector3(0, 0, 1)
    .applyQuaternion(this.muzzle.getWorldQuaternion(new THREE.Quaternion()))
    .normalize();

    // create and register the projectile
    const proj = new Projectile({
      scene:            cameraManager.scene,     // root scene
      reference:        window.origin,    // origin Object3D at (0,0,0)
      initialPosition:  spawnWorld,
      direction:        forward,
      speed:            this.projectileSpeed,
    });

    entityManager.addEntity(proj);
  }

  
  

  static attachTurret(hostEntity) {
    const t = new Turret({
      scene:  hostEntity.model.parent,
      position: hostEntity.position.clone(),
      host:   hostEntity
    });
    t.setHackable(false);
    hostEntity.model.add(t.model);
    return t;
  }
}
