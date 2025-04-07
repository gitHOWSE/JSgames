// entities/Entity.js
import * as THREE from "three";
import { Movement } from "./Movement.js";
import { Item } from "./Items.js";

export class Entity {
  static nextId = 0;
  tag = "default";
  max_health = 1;
  health = 1;
  max_charge = 60;
  charge = 60;
  position = new THREE.Vector3(0, 0, 0);
  prevPosition = new THREE.Vector3(0, 0, 0);
  movement = new Movement();
  item = new Item();

  //JAMES: Headlight property.
  headlight = null;

  //JAMES: The mesh representing this entity in the scene.
  mesh = null;

  // WARNING: DO NOT CREATE ENTITIES THIS WAY; USE ENTITYMANAGER!!!
  constructor(tag, max_health, max_charge, movement, item) {
    this.id = Entity.nextId;
    Entity.nextId++;
    this.is_player = false;
    this.tag = tag;
    this.max_health = max_health;
    this.health = this.max_health;
    this.max_charge = max_charge;
    this.charge = this.max_charge;
    this.movement = movement;
    this.item = item;
  }

  //JAMES: Returns the forward direction vector.
  getForwardDirection() {
    const forward = new THREE.Vector3(0, 0, -1);
    if (this.mesh && this.mesh.quaternion) {
      forward.applyQuaternion(this.mesh.quaternion);
    }
    return forward.normalize();
  }

  //JAMES: Enables headlights (using a SpotLight).
  enableHeadlights(color = 0xffffff, intensity = 1, distance = 20) {
    if (!this.mesh) {
      console.warn("Entity does not have a mesh; cannot attach headlights.");
      return;
    }
    this.headlight = new THREE.SpotLight(color, intensity, distance);
    this.headlight.castShadow = true;
    this.headlight.angle = Math.PI / 8;
    const forward = this.getForwardDirection();
    const offset = forward.clone().multiplyScalar(2);
    this.headlight.position.copy(offset);
    const target = new THREE.Object3D();
    target.position.copy(forward.clone().multiplyScalar(10));
    this.mesh.add(target);
    this.headlight.target = target;
    this.mesh.add(this.headlight);
  }

  //JAMES: Updates the headlight's position.
  updateHeadlights() {
    if (this.headlight && this.mesh) {
      const forward = this.getForwardDirection();
      const offset = forward.clone().multiplyScalar(2);
      this.headlight.position.copy(offset);
      this.headlight.target.position.copy(forward.clone().multiplyScalar(10));
    }
  }

  //JAMES: Centralized update method.
  update(delta) {
    //JAMES: Process input if player-controlled.
    if (this.is_player && window.controller) {
      this.movement.updateFromInput(window.controller, this, delta);
      //JAMES: Update angular properties and rotate velocity.
      this.movement.updateAngular(delta);
      if (this.mesh) {
        this.mesh.rotateY(this.movement.angularVelocity * delta);
      }
    }

    //JAMES: Apply friction to reduce the acceleration.
    this.movement.applyFriction();
    //JAMES: Apply static friction if net acceleration is too low.
    this.movement.applyStaticFriction();

    //JAMES: Update linear movement.
    this.movement.updateLinear(delta);
    //JAMES: Update the entity's position.
    this.position.add(this.movement.velocity.clone().multiplyScalar(delta));
    //JAMES: Reset acceleration after integration.
    this.movement.acceleration.set(0, 0, 0);
    if (this.mesh) {
      this.mesh.position.copy(this.position);
    }
    if (this.headlight) {
      this.updateHeadlights();
    }
    if (this.is_player && window.cameraManager) {
      window.cameraManager.followObject(this);
    }
  }

  //JAMES: Method to mark this entity as player-controlled.
  makePlayer() {
    this.is_player = true;
  }
  unMakePlayer() {
    this.is_player = false;
  }

  //JAMES: Getters and setters.
  getId() {
    return this.id;
  }
  getTag() {
    return this.tag;
  }
  isPlayer() {
    return this.is_player;
  }
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
  setHealth(newHealth) {
    this.health = Math.min(this.max_health, newHealth);
  }
  heal(toHeal) {
    this.health = Math.min(this.max_health, this.health + toHeal);
  }
  damage(toDamage) {
    this.health -= toDamage;
  }
}

