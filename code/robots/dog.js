import * as THREE from "three";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { clone as cloneModel } from "three/examples/jsm/utils/SkeletonUtils.js";
import { controller } from "../Util/Controller.js";
import { raycast } from "../Util/raycast.js";
import { BaseState } from "./states.js";
import { TeamColour } from "../Util/HeadlightTint.js";
import { Teams } from "../entities/Team.js";

//JAMES: DogPlayerState – when dog is player-controlled
class DogPlayerState extends BaseState {
  update(delta) {
    if ( this.entity.mesh&& !this.entity.lampsOn) {           // JAMES: default ON.
        const tint = TeamColour[this.team];                     // JAMES: side colour.
        this.entity.enableHeadlights(tint, 60, 25);                    // JAMES: spot‑light.
        this.entity.enableBulbLight?.(tint, 8, 12);    
        this.entity.lampsOn
        = true;
                  // JAMES: point‑glow.
      }

    //JAMES: Reset acceleration for this frame
    this.entity.movement.acceleration.set(0, 0, 0);

    //JAMES: Apply player input for dog movement
    if (controller) {
      this.entity.movement.updateFromInput(controller, this.entity, delta);
      this.entity.movement.updateAngular(delta);
    }
    //JAMES: Fire carried turret on action3 ("c")
    if (controller.isControlActive("action3") && this.entity.carryTurret) {
      this.entity.carryTurret.fire();
    }
    //JAMES: Always advance animation
    this.entity.updateAnimation(delta);
    return new THREE.Vector3(0, 0, 0);
  }
}

//JAMES: DogGuardState – wander and scan for player
class DogGuardState extends BaseState {
  constructor(entity) {
    super(entity);
    this.wander = this.entity.behaviour || null;
    this.viewAngle = THREE.MathUtils.degToRad(45);
    this.viewDistance = 10;
  }
  update(delta) {
    //JAMES: Reset acceleration for this frame
    this.entity.movement.acceleration.set(0, 0, 0);
    if ( this.entity.mesh&& !this.entity.lampsOn) {           // JAMES: default ON.
        const tint = TeamColour[this.team];                     // JAMES: side colour.
        this.entity.enableHeadlights(tint, 60, 25);                    // JAMES: spot‑light.
        this.entity.enableBulbLight?.(tint, 8, 12);    
        this.entity.lampsOn
        = true;
                  // JAMES: point‑glow.
      }
    let force = new THREE.Vector3();
    if (this.wander) {
      force
        .copy(this.wander.calculate(delta))
        .clampLength(0, this.entity.movement.maxForce);
    }
    //JAMES: Check line-of-sight and field of view
    if (window.player && window.player.position) {
      const toPlayer = new THREE.Vector3().subVectors(
        window.player.position,
        this.entity.position
      );
      const dist = toPlayer.length();
      if (dist < this.viewDistance) {
        const angle = this.entity
          .getForwardDirection()
          .angleTo(toPlayer.normalize());
        if (
          angle < this.viewAngle &&
          raycast(this.entity.position, window.player.position)
        ) {
          console.log(`//JAMES: Dog ${this.entity.id} switching to AlertState`);
          this.entity.currentState = this.entity.stateAlert;
                    if (this.entity.carryTurret?.onHostAlert) {
                        this.entity.carryTurret.onHostAlert();
                      }
        }
      }
    }
    //JAMES: Always advance animation
    this.entity.updateAnimation(delta);
    return force;
  }
}

//JAMES: DogAlertState – chase player and bite
class DogAlertState extends BaseState {
  update(delta) {
    //JAMES: Reset acceleration for this frame
    this.entity.movement.acceleration.set(0, 0, 0);
    if ( this.entity.mesh&& !this.entity.lampsOn) {           // JAMES: default ON.
        const tint = TeamColour[this.team];                     // JAMES: side colour.
        this.entity.enableHeadlights(tint, 60, 25);                    // JAMES: spot‑light.
        this.entity.enableBulbLight?.(tint, 8, 12);    
        this.entity.lampsOn
        = true;
                  // JAMES: point‑glow.
      }
    if (!window.player || !window.player.position) {
      this.entity.updateAnimation(delta);
      return new THREE.Vector3(0, 0, 0);
    }
    const toPlayer = new THREE.Vector3()
      .subVectors(window.player.position, this.entity.position)
      .normalize();
    //JAMES: Use defined topSpeed (must be set in constructor)
    const desired = toPlayer.multiplyScalar(
      this.entity.movement.topSpeed
    );
    const steer = desired
      .sub(this.entity.movement.velocity)
      .clampLength(0, this.entity.movement.maxForce);
    const dist = this.entity.position.distanceTo(
      window.player.position
    );
    if (dist <= 2) {
      console.log(`//JAMES: Dog ${this.entity.id} bite at ${dist.toFixed(2)}`);
      entityManager.getEntities().forEach((other) => {
        if (
          other.id !== this.entity.id &&
          other.position.distanceTo(this.entity.position) <= 2
        ) {
          other.damage?.(10);
        }
      });
      this.entity.currentState = this.entity.stateGuard;
    } else if (
      !raycast(this.entity.position, window.player.position)
    ) {
      //JAMES: lose sight, revert to guard
      this.entity.currentState = this.entity.stateGuard;
    }
    //JAMES: Always advance animation
    this.entity.updateAnimation(delta);
    return steer;
  }
}

//JAMES: Robo‑Companion Dog entity
export class Dog extends Entity {
  constructor({ scene, position, tag = "dog" } = {}) {
    super({ scene, position, tag });
    this.setHackable(true);
    this.setRobot();
    console.log(`//JAMES: Dog ${this.id} spawned at`, position);

    //JAMES: Initialize movement parameters
    this.movement.maxForce = 20 * 1.5;        // acceleration factor 1.5×
    this.movement.topSpeed = 30;               // top speed 30 units/sec
    this.movement.turningAccelerationFactor = 50; // turning acceleration

    this.loader = new FBXLoader();
    this.mixers = [];
    this.carryTurret = null;

    this.stateGuard = new DogGuardState(this);
    this.stateAlert = new DogAlertState(this);
    this.statePlayer = new DogPlayerState(this);
    this.currentState = this.stateGuard;

    this._loadAnimation();
    if (this.mesh) {           // JAMES: default ON.
        const tint = TeamColour[this.team];                     // JAMES: side colour.
        this.enableHeadlights(tint, 60, 25);                    // JAMES: spot‑light.
        this.enableBulbLight?.(tint, 8, 12);                    // JAMES: point‑glow.
      }
      
      
  }

  async _loadAnimation() {
    const dogFbx = await this.loader.loadAsync(
      "/models/lowpoly/animations/dog/Character_output.fbx"
    );
    const dogMesh = cloneModel(dogFbx);
    dogMesh.rotation.y = Math.PI;
    dogMesh.scale.setScalar(14);
    this.model.add(dogMesh);

    const animFbx = await this.loader.loadAsync(
      "/models/lowpoly/animations/dog/model_Animation_Walking_withSkin.fbx"
    );
    if (animFbx.animations && animFbx.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(dogMesh);
      mixer.clipAction(animFbx.animations[0]).play();
      this.mixers.push(mixer);
      console.log(`//JAMES: Dog ${this.id} walk animation applied`);
    } else {
      console.warn(`//JAMES: No walk animation for Dog ${this.id}`);
    }
  }

  _advanceAnimation(increment) {
    this.mixers.forEach((mixer) => mixer.update(increment));
  }

  updateAnimation(delta) {
    const speed = this.movement.velocity.length();
    const logFactor = Math.log1p(speed);
    const frameInc = delta * logFactor;
  //  console.log(
  //    `//JAMES: Dog ${this.id} speed=${speed.toFixed(2)}, frameInc=${frameInc.toFixed(3)}`
 //   );
    if (isFinite(frameInc)) this._advanceAnimation(frameInc);
  }

  //JAMES: API for turret to trigger dog alert
  onTurretAlert() {
    if (!this.isFrozen && this.currentState !== this.statePlayer) {
      console.log(`//JAMES: Dog ${this.id} alerted by turret`);
      this.currentState = this.stateAlert;
    }
  }

  update(delta) {
    if (this.isFrozen) return;

    if (window.player === this) {
      this.currentState = this.statePlayer;
    }

    const steer = this.currentState.update(delta);
    this.movement.acceleration.add(steer);

    //JAMES: Always advance animation
    this.updateAnimation(delta);
    if ( this.mesh&& !this.lampsOn) {           // JAMES: default ON.
        const tint = TeamColour[this.team];                     // JAMES: side colour.
        this.enableHeadlights(tint, 60, 25);                    // JAMES: spot‑light.
        this.enableBulbLight?.(tint, 8, 12);    
        this.lampsOn
        = true;
                  // JAMES: point‑glow.
      }
    super.update(delta);
  }

  static spawn(scene, position) {
    const d = new Dog({ scene, position });
    entityManager.addEntity(d);
    return d;
  }

  attachTurret(turret) {
    
    this.carryTurret = turret;
    turret.model.position.set(0, 1.5, 0);
    this.model.add(turret.model);
    turret.setHackable(false);
 
    console.log(`//JAMES: Dog ${this.id} now carrying Turret ${turret.id}`);
  }
}
