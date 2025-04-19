// robots/states.js
//JAMES: This module defines AI state classes for robot entities.
//JAMES: Each state encapsulates behavior for a robot when in a given mode.
//JAMES: There are three main states:
//JAMES: - PlayerState: when a player controls the robot (no AI steering is applied)
//JAMES: - GuardState: when the robot is patrolling or wandering; uses a wander behavior
//JAMES: - AlertState: when the robot has detected the player and actively seeks it

import * as THREE from "three";
import { WanderBehaviour } from "./behaviours.js";

import {
  FollowFlowFieldGround,
  FollowFlowFieldStairs,
  FollowFlowFieldFly,
} from "./behaviours.js";

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

export class GuardState extends BaseState {
  constructor(entity) {
    super(entity);
    this.timeSinceLastGoal = 0;
    this.goalDuration = 5 + Math.random() * 10;
    this.assignNewGoal();
  }

  assignNewGoal() {
    const { length, width } = window.levelContext || {};
    if (!length || !width) return;

    const gx = Math.floor(Math.random() * length);
    const gz = Math.floor(Math.random() * width);
    this.goalTile = [gx, gz];

    console.log(`//JAMES: ${this.entity.name} picked new goal tile: [${gx}, ${gz}]`);

    //JAMES: Choose appropriate flowfield type.
    let BehaviourClass;
    if (this.entity.canFly) {
      BehaviourClass = FollowFlowFieldFly;
    } else if (this.entity.canStair) {
      BehaviourClass = FollowFlowFieldStairs;
    } else {
      BehaviourClass = FollowFlowFieldGround;
    }

    this.behaviour = new BehaviourClass(this.entity, this.goalTile);
  }

  update(delta) {
    if (!this.entity.isMovable || !this.behaviour) return new THREE.Vector3(0, 0, 0);

    this.timeSinceLastGoal += delta;
    if (this.timeSinceLastGoal >= this.goalDuration) {
      this.assignNewGoal();
      this.timeSinceLastGoal = 0;
    }

    this.entity.movement.acceleration.set(0, 0, 0);
    const force = this.behaviour.calculate(delta);
    this.entity.movement.acceleration.add(force);

    this.entity.updateAnimation?.(delta);
    return force;
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
