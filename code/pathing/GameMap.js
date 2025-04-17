import * as THREE from 'three';
import { MapGraph } from './MapGraph.js';
//import { MapRenderer } from './MapRenderer.js';
import { VectorUtil } from '../Util/VectorUtil.js';


export class GameMap {

  // Constructor for our GameMap class
  constructor() {
  
    // Initialize bounds in here!
    this.bounds = new THREE.Box3(
      new THREE.Vector3(-100,0,-80), // scene min
      new THREE.Vector3(100,0,80) // scene max
    );

    // worldSize is a Vector3 with 
    // the dimensions of our bounds
    this.worldSize = new THREE.Vector3();
    this.bounds.getSize(this.worldSize);

    // Let's define a tile size
    // for our tile-based map
    this.tileSize = 10;

    // Columns and rows of our tile world
    let cols = this.worldSize.x/this.tileSize;
    let rows = this.worldSize.z/this.tileSize;

    // Create our graph!
    this.mapGraph = new MapGraph(cols, rows);

    // Create our map renderer
    //this.mapRenderer = new MapRenderer(this);

    // Create our game object
    //this.gameObject = this.mapRenderer.createRendering();


    // Initialize the vector field
    this.vectorField = new Map();
    // Create our goals
    let goals = this.createRandomGoals(3);

    // Set up the vector field
    this.setupVectorField(goals);
  }


  // Method to get the world location from a node
  localize(node) {
    // Calculates the x, y, z coordinates based on tile location
    let x = this.bounds.min.x + (node.i * this.tileSize) + this.tileSize/2;
    let y = this.tileSize/2;
    let z = this.bounds.min.z + (node.j * this.tileSize) + this.tileSize/2;
    
    return new THREE.Vector3(x,y,z);
  }

  
  // Method to create an array of random goals
  createRandomGoals(numGoals) {
    let goals = [];

    if (numGoals > this.mapGraph.length() || numGoals < 0) {
      console.log("Invalid number of goals.");
      return goals;
    }

    // Loop to create the specified number of goals
    while (goals.length < numGoals) {

      // Get a random node of type ground
      let randomNode = this.mapGraph.getRandomGroundNode();

      // If the node is not already added add it to the goals
      if (!goals.includes(randomNode)) {
        goals.push(randomNode);

        // Highlight the random goal node red
        //this.gameObject.add(this.mapRenderer.highlight(randomNode, 'red'));
      }
    }
    return goals;
  }


  // Takes an array containing the goal nodes and returns a vector field
  setupVectorField(goals) {
    // Get costs map
    let costs = this.mapGraph.multiGoalDijkstra(goals);

    for (const node of this.mapGraph.nodes) {
      // Setting vector of goal nodes to zero vector
      if (goals.includes(node)) {
        this.vectorField.set(node, new THREE.Vector3(0, 0, 0));
        continue;
      }

      let bestNeighbour = null;
      let bestCost = Infinity;

      // Determining the neighbour closest to the goal
      for (const edge of node.edges) {
        let neighbour = edge.node;

        // Checks if neighbour has access to goal
        if (costs.has(neighbour)) {
          let neighbourCost = costs.get(neighbour);

          // Found a better neighbour
          if (neighbourCost < bestCost) {
            bestCost = neighbourCost;
            bestNeighbour = neighbour;
          }
        }
      }

      // Setting the vector to point to the goal
      if (bestNeighbour === null) {
        // No way to access goal from this node -> set vector to zero
        this.vectorField.set(node, new THREE.Vector3(0, 0, 0));
      } else {
        // Can access goal from this node -> find direction to node
        let currentPos = this.localize(node);
        let neighbourPos = this.localize(bestNeighbour);
        let direction = neighbourPos.clone().sub(currentPos).normalize();

        this.vectorField.set(node, direction);
      }
    }

    // Debug methods
    //let vectorFieldGraphics = this.mapRenderer.createVectorFieldRendering(this.vectorField);
    //this.gameObject.add(vectorFieldGraphics);

  }

}