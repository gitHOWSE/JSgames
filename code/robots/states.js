// robots/states.js
//JAMES: This module defines AI state classes for robot entities.
//JAMES: Each state encapsulates behavior for a robot when in a given mode.
//JAMES: There are three main states:
//JAMES: - PlayerState: when a player controls the robot (no AI steering is applied)
//JAMES: - GuardState: when the robot is patrolling or wandering; uses a wander behavior
//JAMES: - AlertState: when the robot has detected the player and actively seeks it

import * as THREE from "three";
import { WanderBehaviour } from "./behaviours.js";

//
// BaseState - a default state with no steering force
//
export class BaseState {
  //JAMES: Each state is associated with an entity whose behavior is modified.
  constructor(entity) {
    this.entity = entity;
  }

  //JAMES: The update method is called each frame with delta time.
  update(delta) {
    //JAMES: Base state does nothing by default.
    return new THREE.Vector3(0, 0, 0);
  }
}

//
// PlayerState - when the robot is under player control
//
export class PlayerState extends BaseState {
  //JAMES: In PlayerState, the robot does not compute an AI steering force;
  //JAMES: the entity is updated via player input from the Movement class.
  update(delta) {
    //JAMES: Player input is already processed elsewhere,
    //JAMES: so no extra AI force is needed.
    return new THREE.Vector3(0, 0, 0);
  }
}

//
// GuardState - when the robot is patrolling/wandering
//
export class GuardState extends BaseState {
  //JAMES: Constructor receives wander parameters if needed.
  constructor(
    entity,
    { circleDistance = 2, circleRadius = 1, jitterAmount = 0.2 } = {},
  ) {
    super(entity);
    //JAMES: Create an instance of the wander behavior for this entity.
    this.wander = new WanderBehaviour(this.entity, {
      circleDistance,
      circleRadius,
      jitterAmount,
    });
  }

  update(delta) {
    //JAMES: Calculate the steering force for wandering.
    const steeringForce = this.wander.calculate(delta);
    //JAMES: Clamp the steering force so it does not exceed the entity's maximum force.
    steeringForce.clampLength(0, this.entity.movement.maxForce);
    //JAMES: Return the steering force to be applied in the entity update.
    return steeringForce;
  }
}

//
// AlertState - when the robot is actively seeking the player (target)
//
export class AlertState extends BaseState {
  //JAMES: Constructor accepts the target entity (or its position) to seek.
  constructor(entity, target) {
    super(entity);
    this.target = target; //JAMES: Typically the player entity.
  }

  update(delta) {
    //JAMES: Compute the vector from the entity to the target.
    const desiredDirection = new THREE.Vector3()
      .subVectors(this.target.position, this.entity.position)
      .normalize();
    //JAMES: The desired velocity is in the direction of the target scaled by the robot's top speed.
    const desiredVelocity = desiredDirection.multiplyScalar(
      this.entity.movement.topSpeed,
    );
    //JAMES: Steering force is the difference between desired velocity and the current velocity.
    const steeringForce = new THREE.Vector3().subVectors(
      desiredVelocity,
      this.entity.movement.velocity,
    );
    //JAMES: Clamp the steering force to the entity's maxForce.
    steeringForce.clampLength(0, this.entity.movement.maxForce);
    //JAMES: Return the computed steering force.
    return steeringForce;
  }
}
