// robots/turret.js
import * as THREE from "three";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { raycast } from "../Util/raycast.js";
import { Projectile } from "./projectiles.js";
import { BaseState } from "./states.js";
import { controller } from "../Util/Controller.js";

//JAMES: Turret-specific GuardState - spins in place on all axes
class TurretGuardState extends BaseState {
  constructor(entity) {
    super(entity);
  }
  update(delta) {
    if (this.entity.isFrozen) {
      console.log(`//JAMES: Turret ${this.entity.id} is frozen; skipping spin`);
      return new THREE.Vector3(0, 0, 0);
    }
    const spinAmt = this.entity.rotationSpeed * delta;
    this.entity.model.rotateX(spinAmt);
    this.entity.model.rotateY(spinAmt);
    this.entity.model.rotateZ(spinAmt);
    //console.log(`//JAMES: Turret ${this.entity.id} spinning by ${THREE.MathUtils.radToDeg(spinAmt).toFixed(1)}° on each axis`);
    return new THREE.Vector3(0, 0, 0);
  }
}

//JAMES: Turret-specific AlertState - smoothly faces player in 3D
class TurretAlertState extends BaseState {
  constructor(entity) {
    super(entity);
  }
  update(delta) {
    if (this.entity.isFrozen) {
      console.log(`//JAMES: Turret ${this.entity.id} is frozen; skipping face`);
      return new THREE.Vector3(0, 0, 0);
    }
    const model = this.entity.model;
    const targetPos = window.player.position.clone();
    const up = new THREE.Vector3(0, 1, 0);
    const lookMat = new THREE.Matrix4().lookAt(model.position, targetPos, up);
    const targetQuat = new THREE.Quaternion().setFromRotationMatrix(lookMat);
    const angle = model.quaternion.angleTo(targetQuat);
    const t = angle > 0 ? Math.min(1, (this.entity.rotationSpeed * delta) / angle) : 1;
    model.quaternion.slerp(targetQuat, t);
    //console.log(`//JAMES: Turret ${this.entity.id} slerp towards player by ${t.toFixed(2)}`);
    return new THREE.Vector3(0, 0, 0);
  }
}

//JAMES: Turret-specific PlayerState - idle
class TurretPlayerState extends BaseState {
  constructor(entity) {
    super(entity);
  }
  update(delta) {
    //console.log(`//JAMES: Turret ${this.entity.id} in PlayerState (idle)`);
    return new THREE.Vector3(0, 0, 0);
  }
}

//JAMES: Turret entity with state-machine, firing, and hacking
export class Turret extends Entity {
  constructor({ scene, position, tag = "turret" }) {
    super({ scene, position, tag });
    this.setHackable(true);
    //console.log(`//JAMES: Turret ${this.id} constructor`);

    
    this.fireCooldown = 3.5;
    this.cooldownTimer = 0;
    this.projectileSpeed = 75;
    this.rotationSpeed = THREE.MathUtils.degToRad(90);
    this.fireAngleThreshold = THREE.MathUtils.degToRad(10);

    
    this.stateGuard = new TurretGuardState(this);
    this.stateAlert = new TurretAlertState(this);
    this.statePlayer = new TurretPlayerState(this);
    this.currentState = this.stateGuard;

    
    assetLoader.load("turret", "/models/robots/turret.glb")
      .then(mesh => {
        this.mesh = mesh;
        mesh.rotation.y = Math.PI / 2;
        this.model.add(mesh);
        console.log(`//JAMES: Turret ${this.id} mesh loaded`);
      })
      .catch(err => console.error(`//JAMES: Turret ${this.id} mesh failed`, err));
  }

  chooseState() {
    if (this.isFrozen) {
      this.currentState = this.stateGuard;
      return;
    }
    const hasLOS = raycast(this.position, window.player.position);
    console.log(`//JAMES: Turret ${this.id} LOS=${hasLOS}`);
    if (this === window.player) this.currentState = this.statePlayer;
    else if (hasLOS) this.currentState = this.stateAlert;
    else this.currentState = this.stateGuard;
  }

  update(delta) {
    if (this.isFrozen) return;
    this.chooseState();
    this.currentState.update(delta);

    this.cooldownTimer = Math.max(0, this.cooldownTimer - delta);
    if (this.currentState === this.stateAlert) {
      const toPlayer = new THREE.Vector3().subVectors(window.player.position, this.position).normalize();
      const angle = this.getForwardDirection().angleTo(toPlayer);
      if (this.cooldownTimer === 0 && angle <= this.fireAngleThreshold) this.fire();
    }
    if (this.currentState === this.statePlayer && controller.isControlActive("action2") && this.cooldownTimer === 0) {
      this.fire();
    }

    super.update(delta);
  }

  fire() {
    this.cooldownTimer = this.fireCooldown;
    console.log(`//JAMES: Turret ${this.id} firing`);
    const origin = this.position.clone();
    const direction = this.getForwardDirection();
    const proj = new Projectile({ scene: this.model.parent, position: origin, direction, speed: this.projectileSpeed });
    entityManager.addEntity(proj);
  }

  static attachTurret(robotEntity) {
    const t = new Turret({ scene: robotEntity.model.parent, position: robotEntity.position.clone() });
    t.setHackable(false);
    robotEntity.model.add(t.model);
    entityManager.addEntity(t);
    return t;
  }
}
