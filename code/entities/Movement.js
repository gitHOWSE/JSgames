// entities/Movement.js
import * as THREE from "three";

export class Movement {
  mode = "wheels"; // other valid modes: "legs", "propellers"
  topSpeed = 10;
  maxForce = 10;

  // Variables for linear movement.
  pos = new THREE.Vector3();
  prevPos = new THREE.Vector3();
  velocity = new THREE.Vector3();
  acceleration = new THREE.Vector3();

  //JAMES: Variables for angular turning.
  angularVelocity = 0;
  angularAcceleration = 0;
  //JAMES: Base turning acceleration factor (set per entity).
  turningAccelerationFactor = 18.0;
  //JAMES: Constant to damp turning effectiveness at high speeds.
  turningSpeedDampening = 0.3;

  //JAMES: Flag to indicate whether turning input is active.
  isTurning = false;

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
    this.isTurning = false;
  }

  //JAMES: Update input-based acceleration for player-controlled entity.
  updateFromInput(controller, entity, delta) {
    if (entity !== window.player) return;
    const forward = entity.getForwardDirection();
    const accelerationFactor = 10;

    //JAMES: Apply forward/backward acceleration based on input.
    if (controller.isControlActive("up")) {
      this.acceleration.add(forward.clone().multiplyScalar(accelerationFactor));
    }
    if (controller.isControlActive("down")) {
      this.acceleration.add(
        forward.clone().multiplyScalar(-accelerationFactor),
      );
    }

    //JAMES: Determine if the entity is moving backwards using current velocity.
    // If the dot product between velocity and forward is negative, the entity is moving in reverse.
    const dot = this.velocity.dot(forward);
    const movingBackward = dot < 0;

    //JAMES: Compute current speed.
    const speed = this.velocity.length();
    //JAMES: Calculate effective turning acceleration, which decreases with speed.
    const effectiveTurningAcceleration =
      this.turningAccelerationFactor / (1 + this.turningSpeedDampening * speed);

    //JAMES: Process left/right input and invert turning direction if moving backward.
    if (controller.isControlActive("left") && this.isTurning == false) {
      this.angularAcceleration = movingBackward
        ? -effectiveTurningAcceleration
        : effectiveTurningAcceleration;
      this.isTurning = true;
    } else if (controller.isControlActive("right") && this.isTurning == false) {
      this.angularAcceleration = movingBackward
        ? effectiveTurningAcceleration
        : -effectiveTurningAcceleration;
      this.isTurning = true;
    } else {
      this.angularAcceleration = 0;
      this.isTurning = false;
    }
  }

  //JAMES: Update angular velocity and rotate the velocity vector.
  updateAngular(delta) {
    //JAMES: Integrate angular acceleration.
    this.angularVelocity += this.angularAcceleration * delta;
    //JAMES: Apply damping to angular velocity.
    const angularDamping = this.isTurning ? 0.995 : 0.9;
    this.angularVelocity *= angularDamping;
    //JAMES: Rotate the current velocity vector around the Y-axis by the angular change.
    this.velocity.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.angularVelocity * delta,
    );
  }

  //JAMES: Update linear velocity based on current acceleration.
  updateLinear(delta, forwardDirection = null) {
    //JAMES: Add acceleration contribution.
    this.velocity.add(this.acceleration.clone().multiplyScalar(delta));
    //JAMES: Clamp velocity to the top speed.
    if (this.velocity.length() > this.topSpeed) {
      this.velocity.setLength(this.topSpeed);
    }
    //JAMES: If a forward direction is provided, no turning input is active,
    //       and velocity exists, reorient the velocity.
    if (forwardDirection && !this.isTurning && this.velocity.length() > 0) {
      const currentSpeed = this.velocity.length();
      const dot = this.velocity.dot(forwardDirection);
      //JAMES: If the dot product is positive, we're moving forward.
      if (dot >= 0) {
        this.velocity.copy(
          forwardDirection.clone().normalize().multiplyScalar(currentSpeed),
        );
      } else {
        //JAMES: If the dot product is negative, we're moving in reverse.
        this.velocity.copy(
          forwardDirection
            .clone()
            .negate()
            .normalize()
            .multiplyScalar(currentSpeed),
        );
      }
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
