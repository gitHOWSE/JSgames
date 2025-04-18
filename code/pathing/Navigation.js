///////////////////////////////////
//        file: Navigation.js    //
//      author: Steven Sproule   //
//      e-mail: sasproule@mun.ca //
//  student id: 201918430        //
//     version: 1                //
// ----------------------------- //
// description: provides a "map" //
// of the game world and gives   //
// the AI functions to access    //
// that map for basic pathing.   //
///////////////////////////////////

import * as THREE from 'three';
import { MapNode } from '/pathing/MapNode.js';
import { MapGraph } from '/pathing/MapGraph.js';

export class Navigation
{
	constructor(tileArray, announce = true)
	{
		if (announce) console.log("[Navigation] generating navigation data...");
		//const [x, y, z] = coords;

		this.tileArray = tileArray;
		this.length = this.tileArray.length;
		this.height = this.tileArray[0].length;
		this.width  = this.tileArray[0][0].length;

		if (announce) console.log("[Navigation] generating mapGraphs...");
		this.mapGraphs = {
			ramp:  new MapGraph(this.tileArray),
			stair: new MapGraph(this.tileArray, true),
			cliff: new MapGraph(this.tileArray, true, true)
		};
		if (announce) console.log("[Navigation] mapGraphs generated!");

		this.vectorFields = {
			ramp:  new Map(),
			stair: new Map(),
			cliff: new Map()
		};

		const vfNum = 3*this.length*this.width;
		if (announce) console.log("[Navigation] generating",vfNum,"vector fields...");
		this.pregenerateVectorFields();
		if (announce) console.log("[Navigation]",vfNum,"vector fields generated!");

		if (announce) console.log("[Navigation] navigation data generated!");
	}

	// Returns the lowest non-floor tile at position (x, z)
	// ex. 'wall', 'air', 'ramp', 'end'...
	getTopTile(x, z)
	{
    	for (let y = 0; y < this.tileArray[0].length; y++)
    	{
    		if (this.tileArray[x][y][z].getType() !== 'floor')
    		{
    		return y;
    		}
    	}
	}

	// Returns the node at x,z in tileArray coordinates, from the VF/MA of type
	// valid type values: 'ramp', 'stair', 'cliff'
	getNodeAt(x,z,type)
	{
		return this.mapGraphs[type].get(this.mapGraphs[type].getIndexFromCoords(x,z));
	}

	// Takes bools canStair and canFly and converts them to a string key for navigation Maps
	getTypeFromCanVars(canStair, canFly)
	{
		if      (canFly)   return 'cliff';
		else if (canStair) return 'stair';
		else               return 'ramp';
	}

	pregenerateVectorFields()
	{
		for (let x = 0; x < this.length; x++)
		{
			for (let z = 0; z < this.width; z++)
			{
				// Uncomment to avoid generating vector fields to unreachable positions
				//const y = this.getTopTile(x,z);
				//if (this.tileArray[x][y][z].getType === 'wall') continue;

				const key = `${x},${z}`;

				for (let type of ['ramp','stair','cliff'])
				{
					const goal = this.getNodeAt(x,z,type);
					this.mapGraphs[type].setupVectorField([goal]);
					this.vectorFields[type].set(key, new Map(this.mapGraphs[type].vectorField));
				}
			}
		}
	}

	// Returns a vector field to (x,z)
	getVectorField(x, z, canStair = false, canFly = false)
	{
		const key = `${x},${z}`;
		const type = this.getTypeFromCanVars(canStair, canFly);
		return this.vectorFields[type].get(key);
	}

	// Returns the appropriate mapgraph based on input movement capabilities
	getMapGraph(canStair = false, canFly = false)
	{
		const type = this.getTypeFromCanVars(canStair, canFly);
		return this.mapGraphs[type];
	}

	getDirection(x, z, myX, myZ, canStair = false, canFly = false)
	{
		// Goal DNE or unreachable
		if ((x < 0 || z < 0 || x > this.length || z > this.width)
			|| this.tileArray[x][this.getTopTile(x,z)][z].getType() === 'wall')
		{
			console.log("[Navigation] getDirection() -> target unreachable");
			return new THREE.Vector3();
		}

		const key  = `${x},${z}`;
		const type = this.getTypeFromCanVars(canStair, canFly);
		const node = this.getNodeAt(myX,myZ,type);
		const vector = this.vectorFields[type].get(key).get(node.id);
		const keys = [...this.vectorFields[type].get(key).keys()];
		//console.log("[Navigation] seeking vector from",myX,myZ,"to",x,z,"result:",vector);
		return vector;
	}
}