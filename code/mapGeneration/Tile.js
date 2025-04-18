///////////////////////////////////
//        file: Tile.js          //
//      author: Steven Sproule   //
//      e-mail: sasproule@mun.ca //
//  student id: 201918430        //
//     version: 1                //
// ----------------------------- //
// description: helper class     //
// used extensively in map       //
// generation and pathing.       //
///////////////////////////////////


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