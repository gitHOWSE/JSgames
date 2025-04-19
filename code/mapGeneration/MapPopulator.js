///////////////////////////////////
//        file: MapPopulator.js  //
//      author: Steven Sproule   //
//      e-mail: sasproule@mun.ca //
//  student id: 201918430        //
//     version: 1                //
// ----------------------------- //
// description: takes a fully-   //
// generated tileArray of the    //
// game map and adds entities to //
// it as tiles. Does not         //
// overwrite crucial map topo-   //
// logy (goal, inclines, etc.)   //
///////////////////////////////////

import { Tile } from '/mapGeneration/Tile.js';

export class MapPopulator
{
	static EnemySpawnPreferences = {
			vacuum:     { or: ['open'] },
			goo:        { or: ['open', 'highGround'] },
			turret:     { or: ['room'] },
			dog:        { or: ['nearStair'] },
			dogJockey:  { or: ['nearStair', 'room'] },
			android:    { or: ['hall', 'nearStair'] },
			drone:      { or: ['room', 'nearCliff', 'highGround'] }
		};

	constructor(tileArray, level, announce = true)
	{
		this.announce = announce; // Output status report on spawning

		this.level = level;
		this.tileArray = tileArray;
		this.length    = tileArray.length;
		this.width     = tileArray[0][0].length;
		this.area      = this.length * this.width;
		
		this.enemySpawnDensity = 0.025;
		this.enemyCount = Math.floor(this.area * this.enemySpawnDensity);

		// Weights of enemy spawns for each level.
		this.levelEnemyWeights = {
			level1: {
				vacuum:     2,
				goo: 	    3,
				turret:     1,
				dog:        2,
				dogJockey:  0,
				android:    0,
				drone:      0
			},
			level2: {
				vacuum:     3,
				goo: 	    2,
				turret:     2,
				dog:        3,
				dogJockey:  1,
				android:    4,
				drone:      1
			},
			level3: {
				vacuum:     1,
				goo: 	    2,
				turret:    10,
				dog:        1,
				dogJockey:  3,
				android:    1,
				drone:      5
			},
		};

		// Controls number of gooboiz per swarm
		this.gooswarmMinCount = 1;
		this.gooswarmMaxCount = 5;
	}

	// Returns the y-coordinate of the first non-floor tile found (if 0 then it's a wall)
	getTopTile(x,z)
	{
		for (let y = 0; y < this.tileArray[0].length; y++)
		{
			if (this.tileArray[x][y][z].getType() !== 'floor')
			{
				return y;
			}
		}
	}

	// returns the tile at the coords indicated by a string notation of the coords
	getTileAt(coordStr)
	{
		const [x, y, z] = coordStr.split(',').map(Number);
		return this.tileArray[x][y][z];
	}

	// Sets the tile indicated by the string representation of coords to be a tile of tileType
	setTileAt(coord, tileType, tileFacing = 0)
	{
		const [x, y, z] = coord;
		console.log("Spawning",tileType,"at",x,y,z);
		this.tileArray[x][y][z] = new Tile(tileType, tileFacing);
	}

	debugSpawnCandidateTypes()
	{
		console.log("=== Spawn Candidate Types ===");
		for (const [tag, tileSet] of Object.entries(this.spawnCandidateTypes)) 
		{
			const entries = Array.from(tileSet);
			console.log(`${tag}: ${entries.length} tiles`);
			
			// Uncomment the following lines to print each coordinate (can be a LOT!)
			/*
			for (const coord of entries) {
				console.log(`  ${coord}`);
			}
			*/
		}
	console.log("================================");
	}

	getSpawnNum(enemyType)
	{
		const level = "level" + this.level;
		const weight = this.levelEnemyWeights[level][enemyType];
		let totalWeight = 0;
		for (let e in this.levelEnemyWeights[level])
		{
			totalWeight += this.levelEnemyWeights[level][e];
		}
		return Math.floor(this.enemyCount * (weight / totalWeight));
	}

	generateSpawnCandidateTags() 
	{
		this.spawnCandidateTypes = {
			open: new Set(),
			flat: new Set(),
			room: new Set(),
			hall: new Set(),
			nearRamp: new Set(),
			nearStair: new Set(),
			nearCliff: new Set(),
			highGround: new Set()
		};

		const getTagKey = (x, y, z) => `${x},${y},${z}`;
		const neighborOffsets = [
			[-1, 0], [1, 0], [0, -1], [0, 1]
		];

		for (let x = 1; x < this.length - 1; x++) 
		{
			for (let z = 1; z < this.width - 1; z++) 
			{
				const y = this.getTopTile(x, z);
				const tile = this.tileArray[x][y][z];

				if (!tile || tile.getType() !== 'air') continue;

				const key = getTagKey(x, y, z);
				this.spawnCandidateTypes.open.add(key); // Catch-all spawnable tile

				// ---- ROOM DETECTION ----
				const roomPatterns = [
					[[0, 0], [1, 0], [0, 1], [1, 1]],     // lower-right
					[[0, 0], [-1, 0], [0, 1], [-1, 1]],   // lower-left
					[[0, 0], [1, 0], [0, -1], [1, -1]],   // upper-right
					[[0, 0], [-1, 0], [0, -1], [-1, -1]]  // upper-left
				];

				let isRoom = false;
				for (const pattern of roomPatterns) 
				{
					if (pattern.every(([dx, dz]) => {
						const nx = x + dx;
						const nz = z + dz;
						const ny = this.getTopTile(nx, nz);
						const nTile = this.tileArray[nx]?.[ny]?.[nz];
						return nTile && nTile.getType() !== 'wall';
					})) {
						isRoom = true;
						break;
					}
				}

				if (isRoom) 
				{
					this.spawnCandidateTypes.room.add(key);
				} 
				else 
				{
					this.spawnCandidateTypes.hall.add(key);
				}

				// ---- FLAT CHECK ----
				let isFlat = true;
				for (const [dx, dz] of neighborOffsets) 
				{
					const nx = x + dx;
					const nz = z + dz;
					const ny = this.getTopTile(nx, nz);
					const nTile = this.tileArray[nx]?.[ny]?.[nz];

					if (!nTile || nTile.getType() === 'wall') continue;
					if (ny !== y) {
						isFlat = false;
						break;
					}
				}
				if (isFlat) 
				{
					this.spawnCandidateTypes.flat.add(key);
				}

				// ---- PROXIMITY TAGS ----
				let isNearRamp = false;
				let isNearStair = false;
				let isNearCliff = false;
				let isHighGround = true;
				let lowerFound = false;

				for (const [dx, dz] of neighborOffsets) 
				{
					const nx = x + dx;
					const nz = z + dz;
					const ny = this.getTopTile(nx, nz);
					const neighbor = this.tileArray[nx]?.[ny]?.[nz];

					if (!neighbor) continue;

					const nType = neighbor.getType();
					if (nType === 'ramp') isNearRamp = true;
					if (nType === 'stair') isNearStair = true;
					if (nType === 'cliff') isNearCliff = true;

					if (ny > y) isHighGround = false;
					if (ny < y) lowerFound = true;
				}

				if (isNearRamp) this.spawnCandidateTypes.nearRamp.add(key);
				if (isNearStair) this.spawnCandidateTypes.nearStair.add(key);
				if (isNearCliff) this.spawnCandidateTypes.nearCliff.add(key);
				if (isHighGround && lowerFound) this.spawnCandidateTypes.highGround.add(key);
			}
		}

		//this.debugSpawnCandidateTypes();
		//console.log("LAVA! CHICKEN!");
	}

	// Returns coordinate arrays of all tiles that meet the input candidate requirements
	getCandidateTiles({ and = [], or = [] } = {}) 
	{
		const tagSets = this.spawnCandidateTypes;

		// Helper to get Set of "x,y,z" strings for a tag
		const getTagSet = (tag) => tagSets[tag] || new Set();

		let resultSet = new Set();

		// OR logic: union of all listed tag sets
		if (or.length > 0) 
		{
			resultSet = new Set([...getTagSet(or[0])]);
			for (let i = 1; i < or.length; i++) 
			{
				for (const coord of getTagSet(or[i])) 
				{
					resultSet.add(coord);
				}
			}
		}

		// AND logic: intersection of all listed tag sets
		if (and.length > 0) 
		{
			const andSets = and.map(getTagSet);
			let intersection = new Set(andSets[0]);
			for (let i = 1; i < andSets.length; i++) 
			{
				intersection = new Set([...intersection].filter(x => andSets[i].has(x)));
			}
			// If OR was used too, take the intersection of both sets
			resultSet = (or.length > 0)
				? new Set([...resultSet].filter(x => intersection.has(x)))
				: intersection;
		}

		// Convert from "x,y,z" strings back to coordinate arrays
		return [...resultSet].map(str => str.split(',').map(Number));
	}

	getSpawnCandidates(type)
	{
		const prefs = MapPopulator.EnemySpawnPreferences[type];
		switch (type) {
			case 'vacuum': 		return this.getCandidateTiles(prefs);
			case 'goo': 		return this.getCandidateTiles(prefs);
			case 'turret': 		return this.getCandidateTiles(prefs);
			case 'dog': 		return this.getCandidateTiles(prefs);
			case 'dogJockey': 	return this.getCandidateTiles(prefs);
			case 'android': 	return this.getCandidateTiles(prefs);
			case 'drone': 		return this.getCandidateTiles(prefs);
		}
	}

	populate()
	{
		if (this.announce) console.log("[MapPopulator] spawning entities...")
		this.generateSpawnCandidateTags();

		let entitiesSpawned = 0;

		for (const type of Object.keys(MapPopulator.EnemySpawnPreferences)) 
		{
			const candidates = this.getSpawnCandidates(type);
			//console.log(`Spawn candidates for ${type}: ${candidates.length}`);
			const spawnNum = this.getSpawnNum(String(type));

			// Spawning entities
			for (let i = 0; i < spawnNum; i++)
			{
				const candidateNum = candidates.length;
				if (candidateNum < 1) console.log("No remaining spawn candidates for",type);
				else
				{
					entitiesSpawned++;
					const coordIndex = Math.floor(Math.random() * candidateNum);
					const coord = candidates[coordIndex];
					this.setTileAt(coord, String(type));
					//console.log("[MapPopulator] spawning", type, "at",coord);

					// Removing this location from spawn candidates
					candidates.splice(coordIndex, 1);
				}
			}
		}

		if (this.announce) console.log("[MapPopulator]",entitiesSpawned,"entities spawned!")
		return this.tileArray;
	}
}