///////////////////////////////////
//        file: MapParams.js     //
//      author: Steven Sproule   //
//      e-mail: sasproule@mun.ca //
//  student id: 201918430        //
//     version: 1                //
// ----------------------------- //
// description: provides crucial //
// parameters for map generation //
// based on the current level    //
// being generated.              //
///////////////////////////////////

export class MapParams
{
	static ROOM_TOTAL_MIN_DIM  = 5;   // Minimum room size
	static ROOM_TOTAL_MAX_DIM  = 15;  // Cap on maximum room size (prevents HUGE rooms in large levels)
	static ROOM_MAX_DIM_FACTOR = 0.3; // This * min(length, width) determines room max size

	constructor(level)
	{
		this.index = level - 1;

		// Level Dimensions (do not change between levels)
		this.length    = 27; // MUST BE ODD
		this.width     = 27; // MUST BE ODD
		this.maxHeight = 5;  // MUST BE >1

		// Room Parameters
		this.roomMinDim = MapParams.ROOM_TOTAL_MIN_DIM;
		this.roomMaxDim = Math.floor(Math.max(this.roomMinDim, Math.min(MapParams.ROOM_TOTAL_MAX_DIM,
			Math.floor(MapParams.ROOM_MAX_DIM_FACTOR * Math.min(this.length, this.width)))));
		this.roomNum    = 20;//Math.floor(Math.pow((this.length+this.width)/2,2)/(30*this.roomMaxDim));

		// Incline Params 0 = level 1, 1 = level 2...
		this.rampWeights  = [6, 1, 1];
		this.stairWeights = [3, 6, 3];
		this.cliffWeights = [1, 3, 6];

		this.canStair = [false, true, true];
		this.canFly   = [false, false, true];

		this.minLevelLength = Math.floor(Math.min(this.length, this.width) * 3);

		this.noiseParams = [
			{scale:0.01, octaves:4, persistence:0.5, lacunarity:2.0},
			{scale:0.02, octaves:5, persistence:0.6, lacunarity:1.5},
			{scale:0.05, octaves:6, persistence:0.3, lacunarity:2.5}
		];

		//console.log("I... AM STEVE!");
	}

	getLength()      { return this.length; }
	getWidth()       { return this.width; }
	getMaxHeight()   { return this.maxHeight; }

	getRoomNum()     { return this.roomNum; }
	getRoomMinDim()  { return this.roomMinDim; }
	getRoomMaxDim()  { return this.roomMaxDim; }

	getRampWeight()  { return this.rampWeights[this.index]; }
	getStairWeight() { return this.stairWeights[this.index]; }
	getCliffWeight() { return this.cliffWeights[this.index]; }

	getCanStair()    { return this.canStair[this.index]; }
	getCanFly()      { return this.canFly[this.index]; }

	getMinDistance() { return this.minLevelLength; }

	getNoiseParams() { return this.noiseParams[this.index]; }
}