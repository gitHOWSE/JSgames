export class Tile
{
	constructor(type = 'wall', facing = 0)
	{
		this.type   = type;
		this.facing = facing;
	}

	// Getter methods
	getType()   { return this.type; }
	getFacing() { return this.facing; }

	// Setter methods
	setType(newType)     { this.type   = newType; }
	setFacing(newFacing) { this.facing = newFacing; }
}