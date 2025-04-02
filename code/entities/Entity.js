import * as THREE from "three";
import Movement from "Movement.js";
import Item from "Items.js";

export class Entity
{
	static nextId = 0;
	tag = "default";
	max_health = 1;
	health = 1;
	max_charge = 60;
	charge = 60;
	position = new THREE.Vector3(0,0,0);
	prevPosition = new THREE.Vector3(0,0,0);
	movement = new Movement();
	item = new Item();

	// WARNING: DO NOT CREATE ENTITIES THIS WAY; USE ENTITYMANAGER!!!
	constructor(tag, max_health, max_charge, movement, item)
	{
		this.id = nextId;
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

	getId() 		{ return this.id; }
	getTag() 		{ return this.tag; }
	isPlayer() 		{ return this.is_player; }
	getMaxHealth() 	{ return this.max_health; }
	getHealth() 	{ return this.health; }
	getMaxCharge()	{ return this.max_charge; }
	getCharge()		{ return this.charge; }
	getPos()		{ return this.position; }

	setHealth(newHealth) 	{ this.health = Math.min(this.max_health, newHealth); }
	heal(toHeal) 			{ this.health = Math.min(this.max_health, this.health + toHeal); }
	damage(toDamage) 		{ this.health -= toDamage; }
}