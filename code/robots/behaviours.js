// robots/behaviours.js
//JAMES: This module defines steering behaviors for robot entities.
//JAMES: The Behaviour base class provides a common interface for calculating
//JAMES: steering forces, and the WanderBehaviour class implements a wander behavior
//JAMES: using a projected circle and random jitter.

import * as THREE from "three";

//
// Behaviour Base Class
//
export class Behaviour {
  //JAMES: Constructor takes an entity whose movement is to be controlled.
  constructor(entity) {
    //JAMES: The entity that will be controlled by this behavior.
    this.entity = entity;
  }

  //JAMES: calculate() is called each frame to compute a steering force.
  //JAMES: It should return a THREE.Vector3 force.
  calculate(delta) {
    //JAMES: Base behavior returns no force.
    return new THREE.Vector3(0, 0, 0);
  }
}

export class WanderBehaviour extends Behaviour {
  //JAMES: Constructor for WanderBehaviour.
  //JAMES: circleDistance: distance in front of the entity to project the wander circle.
  //JAMES: circleRadius: radius of the wander circle.
  //JAMES: jitterAmount: maximum random displacement per frame.
  constructor(
    entity,
    { circleDistance = 4, circleRadius = 4, jitterAmount = 0.2 } = {},
  ) {
    super(entity);
    //JAMES: Set the wander parameters.
    this.circleDistance = circleDistance;
    this.circleRadius = circleRadius;
    this.jitterAmount = jitterAmount;

    //JAMES: Initialize the wander target on the circle (in local space).
    this.wanderTarget = new THREE.Vector3(circleRadius, 0, 0);
  }

  //JAMES: calculate() returns a steering force that makes the entity wander.
  calculate(delta) {
    //JAMES: Jitter the wander target by a small random amount.
    const jitter = new THREE.Vector3(
      (Math.random() * 2 - 1) * this.jitterAmount,
      0,
      (Math.random() * 2 - 1) * this.jitterAmount,
    );
    this.wanderTarget.add(jitter);
    //JAMES: Ensure wander target remains on the wander circle.
    this.wanderTarget.setLength(this.circleRadius);

    //JAMES: Project the circle in front of the entity.
    const forward = this.entity.getForwardDirection();
    const circleCenter = forward.clone().multiplyScalar(this.circleDistance);

    //JAMES: Compute the target in world space by adding the circle center and wander target.
    const worldTarget = circleCenter.add(this.wanderTarget);

    //JAMES: Compute the desired velocity in the direction of worldTarget.
    const desiredVelocity = worldTarget
      .clone()
      .normalize()
      .multiplyScalar(this.entity.movement.topSpeed);

    //JAMES: Steering force is the difference between desired velocity and current velocity.
    const steeringForce = desiredVelocity.sub(this.entity.movement.velocity);

    //JAMES: Return the steering force.
    return steeringForce;
  }
}
