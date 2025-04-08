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
  //JAMES: Glow.
  bulb = null;

  //JAMES: The mesh representing this entity in the scene.
  mesh = null;

  //JAMES: Previous quaternion to track mesh rotation changes.
  prevQuaternion = new THREE.Quaternion();

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

    //JAMES: If a mesh is already assigned, initialize prevQuaternion.
    if (this.mesh && this.mesh.quaternion) {
      this.prevQuaternion.copy(this.mesh.quaternion);
    }
  }

  //JAMES: Returns the world forward direction vector.
  getForwardDirection() {
    if (!this.mesh) return new THREE.Vector3(0, 0, -1);

    //JAMES: Retrieve the mesh's world quaternion.
    const worldQuat = new THREE.Quaternion();
    this.mesh.getWorldQuaternion(worldQuat);

    //JAMES: Apply the world quaternion to the default forward vector.
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(worldQuat);
    return forward.normalize();
  }

  //JAMES: Returns the local forward direction vector.
  getLocalForwardDirection() {
    //JAMES: In the mesh's local space, (0, 0, -1) is its forward.
    return new THREE.Vector3(0, 0, -1);
  }

  //JAMES: Enables headlights (using a SpotLight).
  enableHeadlights(color = 0xffffff, intensity = 100, distance = 2000) {
    if (!this.mesh) {
      console.warn("Entity does not have a mesh; cannot attach headlights.");
      return;
    }
    this.headlight = new THREE.SpotLight(color, intensity, distance);
    this.headlight.castShadow = true;
    this.headlight.angle = Math.PI / 7;
    //JAMES: Use the local forward vector so the light will remain local.
    const forward = this.getLocalForwardDirection();
    const offset = forward.clone().multiplyScalar(1);
    this.headlight.position.copy(offset);
    //JAMES: Create a target for the headlight.
    const target = new THREE.Object3D();
    target.position.copy(forward.clone().multiplyScalar(10).setY(1));
    //JAMES: Attach the target as a child of the mesh so it is local.
    this.mesh.add(target);
    this.headlight.target = target;
    //JAMES: Attach the headlight to the mesh.
    this.mesh.add(this.headlight);
  }

  //JAMES: Enables a point light  for local glow.
  enableBulbLight(color = 0xffffff, intensity = 10, distance = 15) {
    if (!this.mesh) {
      console.warn("Entity does not have a mesh; cannot attach bulb light.");
      return;
    }
    this.bulb = new THREE.PointLight(color, intensity, distance);
    this.bulb.position.set(0, 0, 0);
    //JAMES: Add the bulb to the mesh so it moves with the entity.
    this.mesh.add(this.bulb);
  }

  //JAMES: Updates the headlight's position.
  updateHeadlights() {
    if (this.headlight && this.mesh) {
      //JAMES: Update the mesh’s world matrix.
      this.mesh.updateMatrixWorld();

      //JAMES: Use the local forward direction.
      const forward = this.getLocalForwardDirection();
      const headlightOffset = forward.clone().multiplyScalar(1).setY(2);
      const targetOffset = forward.clone().multiplyScalar(10).setY(1);
      this.headlight.position.copy(headlightOffset);
      this.headlight.target.position.copy(targetOffset);
    }
  }

  //JAMES: Centralized update method.
  update(delta) {
    //JAMES: Process input if player-controlled.
    if (this.is_player && window.controller) {
      this.movement.updateFromInput(window.controller, this, delta);
      //JAMES: Update angular properties.
      this.movement.updateAngular(delta);
      if (this.mesh) {
        //JAMES: Rotate the mesh by the angular velocity.
        this.mesh.rotateY(this.movement.angularVelocity * delta);
      }

      //JAMES: After rotating the mesh, update the velocity vector to follow the rotation.
      if (this.mesh) {
        //JAMES: Get the current quaternion of the mesh.
        const currentQuat = this.mesh.quaternion.clone();
        //JAMES: Compute the delta rotation: currentQuat * inverse(prevQuaternion).
        const deltaQuat = currentQuat
          .clone()
          .multiply(this.prevQuaternion.clone().invert());
        //JAMES: Apply the delta rotation to the velocity vector.
        this.movement.velocity.applyQuaternion(deltaQuat);
        //JAMES: Update prevQuaternion for the next frame.
        this.prevQuaternion.copy(currentQuat);
      }
    }

    //JAMES: Apply friction.
    this.movement.applyFriction();
    this.movement.applyStaticFriction();

    //JAMES: Update linear movement.
    //JAMES: We pass the world forward vector so that when not turning the velocity reorients.
    this.movement.updateLinear(delta, this.getForwardDirection());
    //JAMES: Update position based on velocity.
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

  //JAMES: Mark this entity as player-controlled.
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
