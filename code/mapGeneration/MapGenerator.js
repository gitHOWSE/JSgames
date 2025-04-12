import * as THREE from "three";
import { Tile } from "/mapGeneration/Tile.js";
import { NoiseGenerator } from "/mapGeneration/NoiseGenerator.js";
//import { MapValidator } from '/mapGeneration/MapValidator.js';

// Handles creation of maps
export default class MapGenerator {
  constructor(level = 1, seed = Math.random()) {
    // Level generator params
    this.seed = seed;
    this.level = level; // level (1-3) determines map topography and enemy distributions
    this.length = 17; // MUST BE ODD
    this.width = 17; // MUST BE ODD
    this.maxHeight = 5;

    // Array that stores generated level, this is what will be returned. Vector3 coord is index
    this.tileArray = [];
    for (let x = 0; x < this.length; x++) {
      this.tileArray[x] = [];
      for (let y = 0; y < this.maxHeight; y++) {
        this.tileArray[x][y] = [];
        for (let z = 0; z < this.width; z++) {
          this.tileArray[x][y][z] = new Tile("wall");
        }
      }
    }
  }

  // Provides preset noise parameters for each level
  getLevelParams(level) {
    if (level === 1) {
      return { scale: 0.01, octaves: 4, persistence: 0.5, lacunarity: 2.0 };
    } else if (level === 2) {
      return { scale: 0.05, octaves: 5, persistence: 0.6, lacunarity: 1.5 };
    } else if (level === 3) {
      return { scale: 0.2, octaves: 6, persistence: 0.5, lacunarity: 2.5 };
    }
  }

  // Generates the map and returns it as a Map indexed by Vector3 coords.
  generateMap(
    level = 1,
    roomNumIn = 4,
    roomMinDimIn = 3,
    roomMaxDimIn = 6,
    stair1 = 1,
    stair2 = 0,
    stair3 = 0,
  ) {
    const roomNum = roomNumIn;
    const roomMinDim = roomMinDimIn;
    const roomMaxDim = roomMaxDimIn;

    // These modify tileArray to create the level layout
    this.generateWalls();
    this.generateRooms(roomNum, roomMinDim, roomMaxDim);
    this.generateFloors(level);
    this.generateStairsRamps(stair1, stair2, stair3);
  }

  dfs(array, x, z) {
    array[x][z] = "v"; // cell visited

    // Determining which valid neighbours haven't been visited yet
    let neighbours = [];
    if (x - 2 > 0) {
      neighbours.push([x - 2, z]);
    }
    if (x + 2 < this.length) {
      neighbours.push([x + 2, z]);
    }
    if (z - 2 > 0) {
      neighbours.push([x, z - 2]);
    }
    if (z + 2 < this.width) {
      neighbours.push([x, z + 2]);
    }
    neighbours = neighbours.filter((n) => array[n[0]][n[1]] === "u");

    // Creating paths to neighbours
    while (neighbours.length > 0) {
      // Choosing a random neighbour to visit
      let randIndex = Math.floor(Math.random() * neighbours.length);
      let randNeighbour = neighbours[randIndex];

      // Removing the wall between current and randNeighbour
      let middleX = parseInt((x + randNeighbour[0]) / 2);
      let middleZ = parseInt((z + randNeighbour[1]) / 2);
      array[middleX][middleZ] = "v";

      // Exploring randNeighbour's neighbours
      neighbours.splice(randIndex, 1);
      this.dfs(array, randNeighbour[0], randNeighbour[1]);

      // Updating neighbours array to remove visited neighbours
      neighbours = neighbours.filter((n) => array[n[0]][n[1]] === "u");
    }
  }

  // Helper method of generateMap() that generates the maze walls.
  generateWalls() {
    // creating "nodes": no matter the layout, these positions will always be open
    for (let x = 1; x < this.length; x += 2) {
      for (let z = 1; z < this.width; z += 2) {
        for (let y = 0; y < this.maxHeight; y++) {
          this.tileArray[x][y][z] = new Tile("air");
        }
      }
    }

    // Array for recursively generating walls. w = wall, u = unvisited, v = visited.
    const array = Array.from({ length: this.length }, () =>
      Array(this.width).fill("w"),
    );
    for (let x = 1; x < this.length; x += 2) {
      for (let z = 1; z < this.length; z += 2) {
        array[x][z] = "u";
      }
    }

    // Determining starting tile for dfs
    let x = 1;
    let z = 1;
    if (Math.random() < 0.5) {
      if (Math.random() < 0.5) {
        x = 1;
      } else {
        x = this.length - 2;
      }
      z = Math.floor(Math.random() * (this.width - 2));
      if (z % 2 === 0) {
        z++;
      }
    } else {
      if (Math.random() < 0.5) {
        z = 1;
      } else {
        z = this.width - 2;
      }
      x = Math.floor(Math.random() * (this.length - 2));
      if (x % 2 === 0) {
        x++;
      }
    }

    this.dfs(array, x, z); // This is where the layout is made

    // Modifying tileArray to match array
    for (let x = 0; x < this.length; x++) {
      for (let z = 0; z < this.width; z++) {
        if (array[x][z] === "v") {
          for (let y = 0; y < this.maxHeight; y++) {
            const tile = new Tile("air");
            this.tileArray[x][y][z] = tile;
          }
        }
      }
    }
  }

  // Helper method to give random odd ints between min and max inclusive
  getRandomOddInt(min, max) {
    if (min % 2 === 0) {
      min += 1;
    }
    if (max % 2 === 0) {
      max -= 1;
    }
    if (min > max) {
      throw new Error("min greater than max");
    }

    const count = Math.floor((max - min) / 2) + 1; // # of odd numbers between min and max
    const randIndex = Math.floor(Math.random() * count);
    return min + randIndex * 2;
  }

  // Helper method of generateMap() that generates open rooms throughout the level
  generateRooms(roomNum = 4, roomMinDim = 5, roomMaxDim = 11) {
    for (let i = 0; i < roomNum; i++) {
      // Calcuating room position and dimensions
      const xDim = this.getRandomOddInt(roomMinDim, roomMaxDim);
      const zDim = this.getRandomOddInt(roomMinDim, roomMaxDim);
      const xPos = this.getRandomOddInt(1, this.length - xDim);
      const zPos = this.getRandomOddInt(1, this.width - zDim);

      // Generating room
      for (let x = xPos; x < xPos + xDim; x++) {
        for (let z = zPos; z < zPos + zDim; z++) {
          for (let y = 0; y < this.maxHeight; y++) {
            this.tileArray[x][y][z] = new Tile("air");
          }
        }
      }
    }
  }

  // Helper method of generateMap() that generates the floor levels using simplex noise.
  generateFloors() {
    // Making heightmap
    let noise = new NoiseGenerator(this.seed);
    let noiseMap = noise.generateNoiseMap(
      this.length,
      this.width,
      this.getLevelParams(this.level),
    );

    // Translating heightmap to tileArray
    for (let x = 0; x < this.length; x++) {
      for (let z = 0; z < this.width; z++) {
        const height = Math.max(
          1,
          Math.floor(noiseMap[x][z] * (this.maxHeight - 1)),
        );

        for (let y = 0; y < height; y++) {
          let currentTile = this.tileArray[x][y][z];
          if (currentTile.getType() === "air") {
            const tile = new Tile("floor");
            this.tileArray[x][y][z] = tile;
          }
        }
      }
    }
  }

  // Helper method of generateStairsRamps that alters floor positions to prevent weirdness
  fixCornerStairs() {
    for (let x = 0; x < this.length; x++) {
      for (let z = 0; z < this.width; z++) {
        if ((x + z) % 2 !== 0) {
          // Potential for corner stair
          for (let y = 1; y < this.maxHeight - 1; y++) {
            if (
              this.tileArray[x][y][z].getType() === "floor" &&
              this.tileArray[x][y + 1][z].getType() === "air" &&
              (this.tileArray[x][y][z - 1].getType() === "air" ||
                this.tileArray[x + 1][y][z].getType() === "air" ||
                this.tileArray[x][y][z + 1].getType() === "air" ||
                this.tileArray[x - 1][y][z].getType() === "air")
            ) {
              //console.log("CHICKEN JOCKEY!");
              this.tileArray[x][y][z] = new Tile("air");
            }
          }
        }
      }
    }
  }

  // Helper method of generateMap() that strategically adds stairs and ramps to connect floors
  generateStairsRamps(rampWeight = 1, stairWeight = 0, cliffWeight = 0) {
    // Used for determing which type of incline to generate
    const sum = rampWeight + stairWeight + cliffWeight;

    this.fixCornerStairs(); // Alters floor change positions to prevent corner stairs

    for (let x = 0; x < this.length; x++) {
      for (let z = 0; z < this.width; z++) {
        for (let y = 1; y < this.maxHeight - 1; y++) {
          let neighbours = [];
          // Checking if this is a walkable tile
          if (
            this.tileArray[x][y][z].getType() === "air" &&
            this.tileArray[x][y - 1][z].getType() === "floor"
          ) {
            // Determining if neighbours exist and can support inclines
            if (x - 1 > 0) {
              if (
                this.tileArray[x - 1][y][z].getType() === "floor" &&
                this.tileArray[x - 1][y + 1][z].getType() === "air"
              ) {
                neighbours.push(3); // West
              }
            }
            if (x + 1 < this.length) {
              if (
                this.tileArray[x + 1][y][z].getType() === "floor" &&
                this.tileArray[x + 1][y + 1][z].getType() === "air"
              ) {
                neighbours.push(1); // East
              }
            }
            if (z - 1 > 0) {
              if (
                this.tileArray[x][y][z - 1].getType() === "floor" &&
                this.tileArray[x][y + 1][z - 1].getType() === "air"
              ) {
                neighbours.push(0); // North
              }
            }
            if (z + 1 < this.width) {
              if (
                this.tileArray[x][y][z + 1].getType() === "floor" &&
                this.tileArray[x][y + 1][z + 1].getType() === "air"
              ) {
                neighbours.push(2); // South
              }
            }
          }

          // If there are adjacent tiles one floor higher, try generating incline
          if (neighbours.length > 0) {
            const rand = Math.floor(Math.random() * sum);

            if (rand < rampWeight) {
              // Add ramp
              // Determining direction incline should face
              const randIndex = Math.floor(Math.random() * neighbours.length);
              this.tileArray[x][y][z] = new Tile("ramp", neighbours[randIndex]);
            } else if (rand < rampWeight + stairWeight) {
              // Add stair
              // Determining direction incline should face
              const randIndex = Math.floor(Math.random() * neighbours.length);
              this.tileArray[x][y][z] = new Tile(
                "stair",
                neighbours[randIndex],
              );
            } else {
            } // This will be a cliff, so we add nothing
          }
        }
      }
    }
  }

  // DEBUG: creates a mesh based on the map for visualisation
  generateDebug() {
    this.generateMap();

    const scale = 1;
    const wallGeo = new THREE.BoxGeometry(scale, scale, scale);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const rampMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const stairMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const levelGeo = new THREE.Group();
    for (let x = 0; x < this.length; x++) {
      for (let z = 0; z < this.width; z++) {
        for (let y = 0; y < this.maxHeight; y++) {
          if (this.tileArray[x][y][z].getType() === "wall") {
            const cube = new THREE.Mesh(wallGeo, wallMat);
            cube.position.set(
              scale * (x - 0.5 * this.length),
              scale * y - scale,
              scale * (z - 0.5 * this.width),
            );
            levelGeo.add(cube);
          } else if (this.tileArray[x][y][z].getType() === "floor") {
            const cube = new THREE.Mesh(wallGeo, floorMat);
            cube.position.set(
              scale * (x - 0.5 * this.length),
              scale * y - scale,
              scale * (z - 0.5 * this.width),
            );
            levelGeo.add(cube);
          } else if (this.tileArray[x][y][z].getType() === "ramp") {
            const cube = new THREE.Mesh(wallGeo, rampMat);
            cube.position.set(
              scale * (x - 0.5 * this.length),
              scale * y - scale,
              scale * (z - 0.5 * this.width),
            );
            levelGeo.add(cube);
          } else if (this.tileArray[x][y][z].getType() === "stair") {
            const cube = new THREE.Mesh(wallGeo, stairMat);
            cube.position.set(
              scale * (x - 0.5 * this.length),
              scale * y - scale,
              scale * (z - 0.5 * this.width),
            );
            levelGeo.add(cube);
          }
        }
      }
    }

    return levelGeo;
  }
}
