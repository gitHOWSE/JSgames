// entities/Movement.js
import * as THREE from "three";

export class Movement {
  mode = "wheels"; // other valid modes: "legs", "propellers"
  topSpeed = 10;
  maxForce = 10;

  //JAMES: Variables for linear movement.
  pos = new THREE.Vector3();
  prevPos = new THREE.Vector3();
  velocity = new THREE.Vector3();
  acceleration = new THREE.Vector3();

  //JAMES: Variables for angular turning.
  angularVelocity = 0;
  angularAcceleration = 0;
  //JAMES: Base turning acceleration factor (set per entity).
  turningAccelerationFactor = 1.0;
  //JAMES: Constant to damp turning effectiveness at high speeds.
  turningSpeedDampening = 0.1;

  constructor(mode, topSpeed, maxForce) {
    this.mode = mode;
    this.topSpeed = topSpeed;
    this.maxForce = maxForce;
    this.pos = new THREE.Vector3();
    this.prevPos = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.angularVelocity = 0;
    this.angularAcceleration = 0;
  }

  //JAMES: Update input-based acceleration for player-controlled entity.
  updateFromInput(controller, entity, delta) {
    if (!entity.is_player) return;

    const forward = entity.getForwardDirection();
    const accelerationFactor = 10;
    if (controller.isControlActive("up")) {
      this.acceleration.add(forward.clone().multiplyScalar(accelerationFactor));
    }
    if (controller.isControlActive("down")) {
      this.acceleration.add(
        forward.clone().multiplyScalar(-accelerationFactor),
      );
    }

    //JAMES: Compute effective turning acceleration that decreases with speed.
    const speed = this.velocity.length();
    const effectiveTurningAcceleration =
      this.turningAccelerationFactor / (1 + this.turningSpeedDampening * speed);
    if (controller.isControlActive("left")) {
      this.angularAcceleration = -effectiveTurningAcceleration;
    } else if (controller.isControlActive("right")) {
      this.angularAcceleration = effectiveTurningAcceleration;
    } else {
      this.angularAcceleration = 0;
    }
  }

  //JAMES: Update angular velocity and rotate the velocity vector.
  updateAngular(delta) {
    // Integrate angular acceleration.
    this.angularVelocity += this.angularAcceleration * delta;
    // Apply damping.
    const angularDamping = 0.9;
    this.angularVelocity *= angularDamping;
    // Rotate the current velocity vector by the angular change.
    this.velocity.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.angularVelocity * delta,
    );
  }

  //JAMES: Update linear velocity based on current acceleration.
  updateLinear(delta) {
    this.velocity.add(this.acceleration.clone().multiplyScalar(delta));
    if (this.velocity.length() > this.topSpeed) {
      this.velocity.setLength(this.topSpeed);
    }
    return this.velocity;
  }

  //JAMES: Apply friction (a drag force) to the acceleration.
  applyFriction() {
    const frictionCoefficient = 0.25;
    const frictionAcceleration = this.velocity
      .clone()
      .multiplyScalar(-frictionCoefficient);
    this.acceleration.add(frictionAcceleration);
  }

  //JAMES: Apply static friction: if the net acceleration is too low, zero out acceleration and velocity.
  applyStaticFriction() {
    const staticFrictionThreshold = 0.5;
    if (this.acceleration.length() < staticFrictionThreshold) {
      this.acceleration.set(0, 0, 0);
      this.velocity.set(0, 0, 0);
    }
  }

  //JAMES: Getters and setters...
  getMode() {
    return this.mode;
  }
  getTopSpeed() {
    return this.topSpeed;
  }
  getMaxForce() {
    return this.maxForce;
  }
  getAcceleration() {
    return this.acceleration;
  }
  setMode(newMode) {
    this.mode = newMode;
  }
  setTopSpeed(newTopSpeed) {
    this.topSpeed = newTopSpeed;
  }
  setMaxForce(newMaxForce) {
    this.maxForce = newMaxForce;
  }
  setVelocity(newVelocity) {
    this.velocity = newVelocity;
  }
  setAcceration(newAccel) {
    this.acceleration = newAccel;
  }
  setTurningAccelerationFactor(factor) {
    this.turningAccelerationFactor = factor;
  }
  setTurningSpeedDampening(value) {
    this.turningSpeedDampening = value;
  }
}
