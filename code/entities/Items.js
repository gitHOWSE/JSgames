export class Item
{
	name = "item"
	cooldownTime = 1;
	cooldownLeft = 0;

	constructor(name, cooldownTime)
	{
		this.name = name;
		this.cooldownTime = cooldownTime;
	}

	// Getter Methods
	getName() 			{ return this.name; }
	getCooldownTime() 	{ return this.cooldownTime; }
	getcooldownLeft ()	{ return this.cooldown; }

	// Called by game loop to update cooldownLeft timers
	decrementCooldown()
	{
		if (this.cooldownLeft > 0)
		{
			this.cooldown--;
		}
	}

	// Dummy method to be overwritten by child classes
	use(user, target)
	{
		if (this.cooldownLeft == 0) // do stuff
		{
			this.cooldownLeft = this.cooldownTime; // start cooldown
			return;
		}
		else { return; } // do nothing
	}
}

export class Melee extends Item
{
	damage = 1;
	range = 1;

	constructor(name, cooldownTime, damage, range)
	{
		super(name, cooldownTime);
		this.damage = damage;
		this.range = range;
	}

	use(user, target)
	{
		if (this.cooldownLeft == 0)
		{
			this.cooldownLeft = this.cooldownTime; // Resetting cooldown
			if (user.getPos().distanceTo(target.getPos()) <= this.range) // Target in range
			{
				target.damage(this.damage);
			}
		}
	}
}

export class ranged extends Item
{
	damage = 1;
	speed = 1;
	lifespanTime = 1;
	lifespanLeft = 1;

	constructor(name, cooldownTime, damage, speed, lifespanTime)
	{
		super(name, cooldownTime);
		this.damage = damage;
		this.speed = speed;
		this.lifespanTime = lifespanTime;
		this.lifespanLeft = this.lifespanTime;
	}

	use(user, target)
	{
		if (this.cooldownLeft == 0)
		{
			this.cooldownLeft = this.cooldownTime;
			// spawn projectile with damage and speed using entity's facing direction
		}
	}
}

export class alarm extends Item
{
	constructor(name, cooldownTime)
	{
		super(name, cooldownTime);
	}

	use(user, target)
	{
		if (this.cooldownLeft == 0)
		{
			this.cooldownLeft = this.cooldownTime;
			// set game state to alert, create vector field to target.getPos()
		}
	}
}