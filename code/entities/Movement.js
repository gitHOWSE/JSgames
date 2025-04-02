import * as THREE from "three";

export class Movement
{
	mode = "wheels" // other valid modes are "legs" and "propellers"
	topSpeed = 10;
	maxForce = 10;

	constructor(mode, topSpeed, maxForce)
	{
		this.mode = mode;
		this.topSpeed = topSpeed;
		this.maxForce = maxForce;
		this.pos = new THREE.Vector3();
		this.prevPos = new THREE.Vector3();
		this.velocity = new THREE.Vector3();
		this.acceleration = new THREE.Vector3();
	}

	// Getter methods
	getMode() 	  	  { return this.mode; }
	getTopSpeed() 	  { return this.topSpeed; }
	getMaxForce() 	  { return this.maxForce; }
	getPos()		  { return this.Pos; }
	getPrevPos()	  { return this.prevPos; }
	getAcceleration() { return this.acceleration; }

	// Setter methods, maybe for speed boosts?
	setMode(newMode)		 { this.mode = newMode; }
	setTopSpeed(newTopSpeed) { this.topSpeed = newTopSpeed; }
	setMaxForce(newMaxForce) { this.maxForce = newMaxForce; }
	setPos(newPos)			 { this.pos = newPos; }
	setVelocity(newVelocity) { this.velocity = newVelocity; }
	setAcceration(newAccel)  { this.acceleration = newAccel; }
}