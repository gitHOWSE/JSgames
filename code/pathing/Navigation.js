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
		const graph = this.mapGraphs[type];
		if (!graph) 
		{
			console.error(`[Navigation] No mapGraph for type: ${type}`);
			return undefined;
		}
		const index = graph.getIndexFromCoords(x, z);
		const node = graph.get(index);
		if (!node) 
		{
			console.warn(`[Navigation] No node found at (${x}, ${z}) [index ${index}] in type ${type}`);
		}
		return node;
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

	// Takes goal x and z, then your x and z, as well as optional args for movement ability
	// Returns a Vector3 in the direction you should go to get there.
	// NOTES: coords are in tilespace, not worldspace, also, call this every time you change
	//        position in tilespace, as vectors will change each tile.
	getDirection(x, z, myX, myZ, canStair = false, canFly = false)
	{
		// Goal DNE or unreachable
		if ((x < 0 || z < 0 || x >= this.length || z >= this.width)
			|| this.tileArray[x][this.getTopTile(x,z)][z].getType() === 'wall')
		{
			console.warn("[Navigation] getDirection() -> target unreachable");
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

	// Returns a random point (in tilespace) that is accessible based on input position and args
	getRandomReachablePoint(myX, myZ, canStair = false, canFly = false)
	{
		const type = this.getTypeFromCanVars(canStair, canFly);

		let mapGraph = this.getMapGraph(canStair, canFly);
		const goal = this.getNodeAt(myX, myZ, type);
		mapGraph.setupVectorField([goal], true);
		const vf = mapGraph.vectorField;

		const zero = new THREE.Vector3(0, 0, 0);
		const filteredVF = Array.from(vf.entries()).filter(([key,vec]) => !vec.equals(zero));

		if (filteredVF.length > 0)
		{
			const randIndex = Math.floor(Math.random() * filteredVF.length);
			const [randomKey, randomVec] = filteredVF[randIndex];
			const coords = mapGraph.getCoordsFromIndex(randomKey);
			return coords;
		}
		else
		{
			console.log("No non-zero vectors found.");
		}
	}

	snapDirection(vec)
	{
  		const snapped = new THREE.Vector3(
    		Math.round(vec.x),
    		Math.round(vec.y),
    		Math.round(vec.z)
  		);

  		// Avoid dividing by zero
  		if (snapped.lengthSq() === 0) 
  		{
    		return new THREE.Vector3(0, 0, 0); // Or throw an error if needed
  		}

  		return snapped.normalize();
	}

	// Returns an array of (x, z) coordinate pairs corresponding to a path to follow to x, z
	getPath(x, z, myX, myZ, canStair = false, canFly = false)
	{
		// consts used for comparison to determine direction
		const NORTH = new THREE.Vector3( 0,  0, -1);
		const EAST  = new THREE.Vector3( 1,  0,  0);
		const SOUTH = new THREE.Vector3( 0,  0,  1);
		const WEST  = new THREE.Vector3(-1,  0,  0);
		const ZERO  = new THREE.Vector3( 0,  0,  0);

		const type = this.getTypeFromCanVars(canStair, canFly);
		const goal = this.getNodeAt(x, z, type);

		let current = this.getNodeAt(myX, myZ, type);
		let path = [];

		//console.log("[Navigation] getting path from",myX,myZ,"to",x,z);
		while (current !== goal)
		{
			//console.log("[Navigation] adding point",current.x,current.z,"to path.");
			path.push([current.x, current.z]);

			let dir = this.getDirection(x, z, current.x, current.z, canStair, canFly);
			dir = this.snapDirection(dir); // accounts for floating point errors

			if (dir.equals(NORTH))
			{
				current = this.getNodeAt(current.x, current.z - 1, type);
			}
			else if (dir.equals(EAST))
			{
				current = this.getNodeAt(current.x + 1, current.z, type);
			}
			else if (dir.equals(SOUTH))
			{
				current = this.getNodeAt(current.x, current.z + 1, type);
			}
			else if (dir.equals(WEST))
			{
				current = this.getNodeAt(current.x - 1, current.z, type);
			}
			else if (dir.equals(ZERO))
			{
				console.warn("[Navigation] Pathfinding failed; zero vector");
				return path;
			}
			else console.error("[Navigation] Pathfinding error: illegal vector direction");
		}

		path.push([goal.x, goal.z]);

		//console.log("[Navigation] path found, final coord:",current.x, current.z);
		return path;
	}
}