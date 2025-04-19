///////////////////////////////////
//        file: MapGenerator.js  //
//      author: Steven Sproule   //
//      e-mail: sasproule@mun.ca //
//  student id: 201918430        //
//     version: 1                //
// ----------------------------- //
// description: generates a game //
// map represented by a 3D array //
// complete with walls, rooms,   //
// stairs/ramps/cliffs, and      //
// ensures its goal is reachable //
// from its start, and far away. //
///////////////////////////////////

import * as THREE from 'three';
import { Tile } from '/mapGeneration/Tile.js';
import { NoiseGenerator } from '/mapGeneration/NoiseGenerator.js';
import { MapGraph } from '/pathing/MapGraph.js';
import { MapParams } from '/mapGeneration/MapParams.js';
import { MapPopulator } from '/mapGeneration/MapPopulator.js';

// Handles creation of maps
export default class MapGenerator
{
	static FLOOR_PROPORTION = 0.6; // Average fraction of map area not taken up by walls
	static INACCESSIBLE_ALLOWANCE = 1.25 // Fraction of map allowed to be inaccessible to starting bot

	constructor(level = 1, seed = Math.random())
	{
		// Level generator params
		this.seed 		= seed;
		this.level 		= level; // level (1-3) determines map topography and enemy distributions
		
		this.params     = new MapParams(level); // Stores all parameters, based on level
		
		// Dimension params
		this.length 	= this.params.getLength();
		this.width 		= this.params.getWidth();
		this.maxHeight 	= this.params.getMaxHeight();

		// Room params
		this.roomNum 	= this.params.getRoomNum();	    // default 4
		this.roomMinDim = this.params.getRoomMinDim();	// default 5
		this.roomMaxDim = this.params.getRoomMaxDim();	// default 11

		// Incline params
		this.rampWeight  = this.params.getRampWeight();
		this.stairWeight = this.params.getStairWeight();
		this.cliffWeight = this.params.getCliffWeight();

		// Tells pathing algorithm what kinds of terrain player is able to traverse
		this.canStair = this.params.getCanStair();
		this.canFly   = this.params.getCanFly();

		// Minimum distance from start to goal, levels shorter than this will be regenerated
		this.minLevelLength = this.params.getMinDistance();

		// Noiseparams
		this.noiseParams = this.params.getNoiseParams();

		// Array that stores generated level, this is what will be returned. Vector3 coord is index
		this.tileArray = [];
	}

	// Generates the map and returns it as a Map indexed by Vector3 coords.
	generateMap(announce = true)
	{
		if (announce) console.log("[MapGenerator] starting mapgen...");
		this.fillTileArray();
		// These modify tileArray to create the level layout. Initially layout is one solid wall
		this.generateWalls();								 // Carve a labyrinth in the walls
		this.generateRooms(this.roomNum, this.roomMinDim, this.roomMaxDim); // Add open rooms to the labyrinth
		this.generateFloors();							 // Change floor height w/ Perlin
		this.generateStairsRamps(this.rampWeight, this.stairWeight, this.cliffWeight); // Add stairs connecting some floors
		this.generateGoal();
		this.generateSpawn(this.canStair, this.canFly);
		if (announce) console.log("[MapGenerator]",this.length,"x",this.width," mapgen complete!");
	}

	fillTileArray()
	{
		for (let x = 0; x < this.length; x++)
		{
			this.tileArray[x] = []
			for (let y = 0; y < this.maxHeight; y++)
			{
				this.tileArray[x][y] = [];
				for (let z = 0; z < this.width; z++)
				{
					const facing = Math.floor(Math.random()*4);
					this.tileArray[x][y][z] = new Tile('wall',facing);
				}
			}
		}
	}

	dfs(array, x, z)
	{
		array[x][z] = 'v'; // cell visited
		
		// Determining which valid neighbours haven't been visited yet
		let neighbours = [];
		if (x - 2 > 0) 				{ neighbours.push([x - 2, z]); }
		if (x + 2 < this.length) 	{ neighbours.push([x + 2, z]); }
		if (z - 2 > 0)				{ neighbours.push([x, z - 2]); }
		if (z + 2 < this.width)		{ neighbours.push([x, z + 2]); }
		neighbours = neighbours.filter(n => array[n[0]][n[1]] === 'u');

		// Creating paths to neighbours
		while (neighbours.length > 0)
		{
			// Choosing a random neighbour to visit
			let randIndex = Math.floor(Math.random() * neighbours.length);
			let randNeighbour = neighbours[randIndex];

			// Removing the wall between current and randNeighbour
			let middleX = parseInt((x + randNeighbour[0])/2);
			let middleZ = parseInt((z + randNeighbour[1])/2);
			array[middleX][middleZ] = 'v';

			// Exploring randNeighbour's neighbours
			neighbours.splice(randIndex, 1);
			this.dfs(array, randNeighbour[0], randNeighbour[1]);

			// Updating neighbours array to remove visited neighbours
			neighbours = neighbours.filter(n => array[n[0]][n[1]] === 'u');
		}
	}

	// Helper method of generateMap() that generates the maze walls.
	generateWalls()
	{
		// creating "nodes": no matter the layout, these positions will always be open
		for (let x = 1; x < this.length; x += 2)
		{
			for (let z = 1; z < this.width; z += 2)
			{
				for (let y = 0; y < this.maxHeight; y++)
				{
					this.tileArray[x][y][z] = new Tile('air');
				}
			}
		}

		// Array for recursively generating walls. w = wall, u = unvisited, v = visited.
		const array = Array.from({length: this.length}, () => Array(this.width).fill('w'));
		for (let x = 1; x < this.length; x += 2)
		{
			for (let z = 1; z < this.width; z += 2)
			{
				array[x][z] = 'u';
			}
		}

		// Determining starting tile for dfs
		let x = 1;
		let z = 1;
		if (Math.random() < 0.5)
		{
			if (Math.random() < 0.5) { x = 1; }
			else					 { x = this.length - 2; }
			z = Math.floor(Math.random() * (this.width - 2));
			if (z % 2 === 0) { z++; }
		}
		else
		{
			if (Math.random() < 0.5) { z = 1; }
			else					 { z = this.width - 2; }
			x = Math.floor(Math.random() * (this.length - 2));
			if (x % 2 === 0) { x++; }
		}

		this.dfs(array, x, z); // This is where the layout is made

		// Modifying tileArray to match array
		for (let x = 0; x < this.length; x++)
		{
			for (let z = 0; z < this.width; z++)
			{
				if (array[x][z] === 'v')
				{
					for (let y = 0; y < this.maxHeight; y++)
					{
						const tile = new Tile('air');
						this.tileArray[x][y][z] = tile;
					}
				}
			}
		}
	}

	// Helper method to give random odd ints between min and max inclusive
	getRandomOddInt(min, max)
	{
		if ( min % 2 === 0 ) { min += 1; }
		if ( max % 2 === 0 ) { max -= 1; }
		if ( min > max )     { throw new Error("min greater than max")};

		const count = Math.floor((max - min) / 2) + 1; // # of odd numbers between min and max
		const randIndex = Math.floor(Math.random() * count);
		return min + randIndex * 2;
	}

	// Helper method of generateMap() that generates open rooms throughout the level
	generateRooms(roomNum = 4, roomMinDim = 5, roomMaxDim = 11)
	{
		for (let i = 0; i < roomNum; i++)
		{
			// Calcuating room position and dimensions
			const xDim = this.getRandomOddInt(roomMinDim, roomMaxDim);
			const zDim = this.getRandomOddInt(roomMinDim, roomMaxDim);
			const xPos = this.getRandomOddInt(1, this.length - xDim);
			const zPos = this.getRandomOddInt(1, this.width - zDim);
			
			// Generating room
			for (let x = xPos; x < xPos + xDim; x++)
			{
				for (let z = zPos; z < zPos + zDim; z++)
				{
					for (let y = 0; y < this.maxHeight; y++)
					{
						this.tileArray[x][y][z] = new Tile('air');
					}
				}
			}
		}
	}

	// Helper method of generateMap() that generates the floor levels using simplex noise.
	generateFloors()
	{
		// Making heightmap
		let noise = new NoiseGenerator(this.seed);
		let noiseMap = noise.generateNoiseMap(
			this.length, this.width, this.noiseParams
			);

		// Translating heightmap to tileArray
		for (let x = 0; x < this.length; x++)
		{
			for (let z = 0; z < this.width; z++)
			{
				const height = Math.max(1, Math.floor(noiseMap[x][z] * (this.maxHeight - 1)));

				for (let y = 0; y < height; y++)
				{
					let currentTile = this.tileArray[x][y][z];
					if (currentTile.getType() === "air")
					{
						const facing = Math.floor(Math.random()*4);
						const tile = new Tile('floor', facing);
						this.tileArray[x][y][z] = tile;
					}
				}
			}
		}
	}

	// Helper method of generateStairsRamps that alters floor positions to prevent weirdness
	fixCornerStairs()
	{
		for (let x = 0; x < this.length; x++)
		{
			for (let z = 0; z < this.width; z++)
			{
				if ((x + z) % 2 !== 0) // Potential for corner stair
				{
					for (let y = 1; y < this.maxHeight - 1; y++)
					{
						if (this.tileArray[x][y][z].getType() === 'floor'
							&& this.tileArray[x][y+1][z].getType() === 'air'
							&& (this.tileArray[x][y][z-1].getType() === 'air'
								|| this.tileArray[x+1][y][z].getType() === 'air'
								|| this.tileArray[x][y][z+1].getType() === 'air'
								|| this.tileArray[x-1][y][z].getType() === 'air'))
						{
							//console.log("CHICKEN JOCKEY!");
							this.tileArray[x][y][z] = new Tile('cliff');
						}
					}
				}
			}
		}
	}

	// Helper method of generateMap() that strategically adds stairs and ramps to connect floors
	generateStairsRamps(rampWeight = 1, stairWeight = 0, cliffWeight = 0)
	{
		// Used for determing which type of incline to generate
		const sum = rampWeight + stairWeight + cliffWeight;

		this.fixCornerStairs(); // Alters floor change positions to prevent corner stairs

		for (let x = 0; x < this.length; x++)
		{
			for (let z = 0; z < this.width; z++)
			{
				for (let y = 1; y < this.maxHeight - 1; y++)
				{
					let neighbours = [];
					// Checking if this is a walkable tile
					if ((this.tileArray[x][y][z].getType() === 'air'
						|| this.tileArray[x][y][z].getType() === 'cliff')
						&& this.tileArray[x][y-1][z].getType() === 'floor')
					{
						// Determining if neighbours exist and can support inclines
						if (x - 1 > 0)
						{
							if (this.tileArray[x-1][y][z].getType() === 'floor'
								&& this.tileArray[x-1][y+1][z].getType() === 'air')
							{
								neighbours.push(3); // West
							}
						}
						if (x + 1 < this.length)
						{
							if (this.tileArray[x+1][y][z].getType() === 'floor'
								&& this.tileArray[x+1][y+1][z].getType() === 'air')
							{
								neighbours.push(1); // East
							}
						}
						if (z - 1 > 0)
						{
							if (this.tileArray[x][y][z-1].getType() === 'floor'
								&& this.tileArray[x][y+1][z-1].getType() === 'air')
							{
								neighbours.push(0); // North
							} 
						}
						if (z + 1 < this.width)
						{
							if (this.tileArray[x][y][z+1].getType() === 'floor'
								&& this.tileArray[x][y+1][z+1].getType() === 'air')
							{
								neighbours.push(2); // South
							}
						}
					}

					// Removing neighbours that do not have room at their bases for
					// the stair/ramp to be accessible
					if (neighbours.includes(0) && this.tileArray[x][y][z+1].getType() === 'floor')
					{
						neighbours.splice(neighbours.indexOf(0), 1);
					}
					if (neighbours.includes(1) && this.tileArray[x-1][y][z].getType() === 'floor')
					{
						neighbours.splice(neighbours.indexOf(1), 1);
					}
					if (neighbours.includes(2) && this.tileArray[x][y][z-1].getType() === 'floor')
					{
						neighbours.splice(neighbours.indexOf(2), 1);
					}
					if (neighbours.includes(3) && this.tileArray[x+1][y][z].getType() === 'floor')
					{
						neighbours.splice(neighbours.indexOf(3), 1);
					}
					
					// If there are adjacent tiles one floor higher, try generating incline
					if (neighbours.length > 0)
					{
						const rand = Math.floor(Math.random() * sum);

						if (rand < rampWeight)	 					// Add ramp
						{
							// Determining direction incline should face
							const randIndex = Math.floor(Math.random() * neighbours.length);
							this.tileArray[x][y][z] = new Tile('ramp', neighbours[randIndex]);
						}
						else if (rand < rampWeight + stairWeight) 	// Add stair
						{
							// Determining direction incline should face
							const randIndex = Math.floor(Math.random() * neighbours.length);
							this.tileArray[x][y][z] = new Tile('stair', neighbours[randIndex]);
						}
						else // This will be a cliff, so we add a cliff marker for the pathing
						{
							const randIndex = Math.floor(Math.random() * neighbours.length);
							this.tileArray[x][y][z] = new Tile('cliff', neighbours[randIndex]);
						}
					}
				}
			}
		}
	}

	// Returns the y-value of the lowest non-floor tile at position (x, z)
  	// ex. 'wall', 'air', 'ramp', 'end'...
  	getTopTile(x, z)
  	{
    	for (let y = 0; y < this.maxHeight; y++)
    	{
      		if (this.tileArray[x][y][z].getType() !== 'floor')
      		{
        		return y;
      		}
    	}
  	}

  	// Adds a goal node to the tileArray (a Tile tagged 'goal')
	generateGoal()
	{
		let goalFound = false;
		while (!goalFound)
		{
			let randX = 1 + Math.floor(Math.random() * (this.length - 3));
			let randZ = 1 + Math.floor(Math.random() * (this.width - 3));
			let randY = this.getTopTile(randX, randZ);

			if (this.tileArray[randX][randY][randZ].getType() === 'air')
			{
				this.tileArray[randX][randY][randZ] = new Tile('goal');
				goalFound = true;
				//console.log("GOAL AT", randX, randY, randZ);
			}
		}
	}

	// Helper method of generateMap() that places a start point in the map
	generateSpawn()
	{
		let mapGraph = new MapGraph(this.tileArray, this.canStair, this.canFly);
		let goals = mapGraph.getGoals();
		let costs = mapGraph.multiGoalDijkstra(goals);

		let playableArea = 0; // Used later to determine what percent of the map is actually
		                      // reachable by currently selected bot (canStair, canFly)

		// Finds the farthest points from the goal
		let nodesByDist = [];
		let maxDistFromGoal = 0;
		for (let [n, c] of costs)
		{
			if (c > 0) playableArea++;
			if (c > maxDistFromGoal)
			{
				maxDistFromGoal = c;
				nodesByDist.push(n);
			}
		}

		// Determining if enough of the map is accessible
		// NOTE: very close to 60% of a map will be non-wall tiles
		const totalPlayableArea = (this.length - 2)*(this.width - 2);
		//console.log("total area", 0.6*totalPlayableArea, "playableArea",playableArea);

		//console.log("Level length:", maxDistFromGoal, "/", this.minLevelLength);
		if (maxDistFromGoal < this.minLevelLength)
		{
			//console.log("THE NETHER!");
			//console.log("[MapGenerator] path to goal is too short; regenerating map...");
			this.generateMap(false);
		}
		else if (playableArea * MapGenerator.INACCESSIBLE_ALLOWANCE
			< totalPlayableArea * MapGenerator.FLOOR_PROPORTION)
		{
			//console.log("[MapGenerator] too much of map is inaccessible; regenerating map...");
			this.generateMap(false);
		}
		else
		{
			let spawnFound = false;
			let farthestNodeIndex = nodesByDist.length - 1;
			while (!spawnFound)
			{
				const x = nodesByDist[farthestNodeIndex].x;
				const z = nodesByDist[farthestNodeIndex].z;
				const y = this.getTopTile(x,z);
				// Prevents spawnpoint from overriding stairs
				if (this.tileArray[x][y][z].getType() === 'air')
				{
					spawnFound = true;
					this.tileArray[x][y][z] = new Tile('start');
					//console.log("WATER BUCKET... RELEASE!");
				}
				//else { console.log("CHICKEN JOCKEYYYYYYY!"); }
				farthestNodeIndex--;
			}
		}
	}

	// DEBUG: creates a mesh based on the map for visualisation
	generateDebug()
	{
		this.generateMap();

		const scale = 1;
		const wallGeo = new THREE.BoxGeometry(scale, scale, scale);
		const wallMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
		const floorMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
		const rampMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
		const stairMat = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide });
		const goalMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
		const startMat = new THREE.MeshStandardMaterial({ color: 0x8888ff });
		const levelGeo = new THREE.Group();
		for (let x = 0; x < this.length; x++) {
			for (let z = 0; z < this.width; z++) {
		    	for (let y = 0; y < this.maxHeight; y++) {
		    		if (this.tileArray[x][y][z].getType() === 'wall')
		    		{
		    			const cube = new THREE.Mesh(wallGeo, wallMat);
		    			cube.position.set(scale*(x - 0.5*this.length), scale*y, scale*(z - 0.5*this.width));
		    			levelGeo.add(cube);
		    		}
		    		else if (this.tileArray[x][y][z].getType() === 'floor')
		    		{
		    			const cube = new THREE.Mesh(wallGeo, floorMat);
		    			cube.position.set(scale*(x - 0.5*this.length), scale*y, scale*(z - 0.5*this.width));
		    			levelGeo.add(cube);
		    		}
		    		else if (this.tileArray[x][y][z].getType() === 'ramp')
		    		{
		    			const geometry = new THREE.PlaneGeometry( scale, scale*Math.sqrt(2));
						const plane = new THREE.Mesh( geometry, rampMat );
						plane.rotateY(Math.PI - Math.PI / 2 * this.tileArray[x][y][z].getFacing());
						plane.rotateX( Math.PI / 4);
						plane.position.set(scale*(x - 0.5*this.length), scale*y, scale*(z - 0.5*this.width));
		    			levelGeo.add(plane);
		    		}
		    		else if (this.tileArray[x][y][z].getType() === 'stair')
		    		{
		    			const geometry = new THREE.PlaneGeometry( scale, scale*Math.sqrt(2));
						const plane = new THREE.Mesh( geometry, stairMat );
						plane.rotateY(Math.PI - Math.PI / 2 * this.tileArray[x][y][z].getFacing());
						plane.rotateX( Math.PI / 4);
						plane.position.set(scale*(x - 0.5*this.length), scale*y, scale*(z - 0.5*this.width));
		    			levelGeo.add(plane);
		    		}
		    		else if (this.tileArray[x][y][z].getType() === 'goal')
		    		{
		    			const cube = new THREE.Mesh(wallGeo, goalMat);
		    			cube.position.set(scale*(x - 0.5*this.length), scale*y, scale*(z - 0.5*this.width));
		    			levelGeo.add(cube);
		    		}
		    		else if (this.tileArray[x][y][z].getType() === 'start')
		    		{
		    			const cube = new THREE.Mesh(wallGeo, startMat);
		    			cube.position.set(scale*(x - 0.5*this.length), scale*y, scale*(z - 0.5*this.width));
		    			levelGeo.add(cube);
		    		}
		    	}
			}
		}

		let mapGraph = new MapGraph(this.tileArray, this.canStair, this.canFly);
		let goals = mapGraph.getGoals();
		let costs = mapGraph.multiGoalDijkstra(goals);
		mapGraph.setupVectorField(goals);
		let vf = mapGraph.vectorField;

		let maxCost = 0;
		let maxNeighbour = null;
		for (let [n,c] of costs)
		{
			if (c > maxCost)
			{
				maxCost = c;
				maxNeighbour = n;
			}
		}

		//console.log("Level length:", maxCost);

		for (let [nid,d] of vf)
		{
			if (d.length() !== 0)
			{
				let n = mapGraph.get(nid);
				let height = this.getTopTile(n.x, n.z) - 1;
				if (this.tileArray[n.x][height+1][n.z].getType() === 'stair'
					|| this.tileArray[n.x][height+1][n.z].getType() === 'ramp')
				{
					height = height + 1;
				}
				const pos = new THREE.Vector3(scale*(n.x - 0.5*this.length), scale*(height+1), scale*(n.z - 0.5*this.width));
				const level = 1 - costs.get(n) / maxCost;
				levelGeo.add(new THREE.ArrowHelper(d, pos, 0.5*scale, 
					(level*255) << 8, scale*0.25, scale*0.25));
			}
		}
		return levelGeo;
	}
}