import * as THREE from 'three';
import { Tile } from '/mapGeneration/Tile.js';
import { NoiseGenerator } from '/mapGeneration/NoiseGenerator.js';
//import { MapValidator } from '/mapGeneration/MapValidator.js';

// Handles creation of maps
export default class MapGenerator
{
	constructor(level = 1, seed = Math.random())
	{
		// Level generator params
		this.seed 		= seed;
		this.level 		= level; // level (1-3) determines map topography and enemy distributions
		this.length 	= 39; // MUST BE ODD
		this.width 		= 39; // MUST BE ODD
		this.maxHeight 	= 5;

		// Array that stores generated level, this is what will be returned. Vector3 coord is index
		this.tileArray = [];
		for (let x = 0; x < this.length; x++)
		{
			this.tileArray[x] = []
			for (let y = 0; y < this.maxHeight; y++)
			{
				this.tileArray[x][y] = [];
				for (let z = 0; z < this.width; z++)
				{
					this.tileArray[x][y][z] = new Tile('wall');
				}
			}
		}
	}

	// Provides preset noise parameters for each level
	getLevelParams(level)
	{
		if (level === 1) 
		{
			return {scale:0.01, octaves:4, persistence:0.5, lacunarity:2.0};
		}

		else if (level === 2) 
		{
			return {scale:0.05, octaves:5, persistence:0.6, lacunarity:1.5};
		}

		else if (level === 3)
		{
			return {scale:0.2, octaves:6, persistence:0.5, lacunarity:2.5};
		}
	}

	// Generates the map and returns it as a Map indexed by Vector3 coords.
	generateMap()
	{
		this.generateWalls();
		//this.generateRooms();
		this.generateFloors();
		//this.generateStairRamps();
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
			for (let z = 1; z < this.length; z += 2)
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

		this.dfs(array, x, z);

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

	// Helper method of generateMap() that generates the floor levels using simplex noise.
	generateFloors()
	{
		// Making heightmap
		let noise = new NoiseGenerator(this.seed);
		let noiseMap = noise.generateNoiseMap(
			this.length, this.width, this.getLevelParams(this.level)
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
						const tile = new Tile('floor');
						this.tileArray[x][y][z] = tile;
					}
				}
			}
		}
	}

	// DEBUG: creates a mesh based on the map for visualisation
	generateDebug()
	{
		this.generateMap();

		const scale = 1;
		const geometry = new THREE.BoxGeometry(scale, scale, scale);
		const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
		const levelGeo = new THREE.Group();
		for (let x = 0; x < this.length; x++) {
			for (let z = 0; z < this.width; z++) {
		    	for (let y = 0; y < this.maxHeight; y++) {
		    		if (this.tileArray[x][y][z].getType() !== 'air')
		    		{
		    			const cube = new THREE.Mesh(geometry, material);
		    			cube.position.set(scale*(x - 0.5*this.length), scale*y - scale, scale*(z - 0.5*this.width));
		    			levelGeo.add(cube); // or add to a group
		    		}
		    	}
			}
		}

		return levelGeo;
	}
}