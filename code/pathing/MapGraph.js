///////////////////////////////////
//        file: MapGraph.js      //
//      author: Steven Sproule   //
//      e-mail: sasproule@mun.ca //
//  student id: 201918430        //
//     version: 1                //
// ----------------------------- //
// description: takes a tileArray//
// and computes all possible     //
// paths within it using nodes   //
// with edges (and edgesIn),     //
// also provides a method to     //
// generate a vector field.      //
///////////////////////////////////

import * as THREE from 'three';
import { MapNode } from './MapNode.js';
import { MinHeap } from '../Util/MinHeap.js';


export class MapGraph {
  
  // Constructor for our MapGraph class
  constructor(tileArray, canStair = false, canFly = false) {
    this.tileArray = tileArray;
    this.nodes = [];
    this.canStair = canStair;
    this.canFly = canFly;
    this.vectorField = new Map();

    // Create nodes and edges
    this.createNodes();
    this.createEdges();
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

  // Get a node at a particular index
  get(index) {
    return this.nodes[index];
  }

  // The number of nodes in our graph
  length() {
    return this.nodes.length;
  }


  // Create tile-based nodes
  createNodes() {

    for (let x = 0; x < this.tileArray.length; x++)
    {
      for (let z = 0; z < this.tileArray[0][0].length; z++)
      {
        let y = this.getTopTile(x,z);
        let tile = this.tileArray[x][y][z];
        let node = new MapNode(this.length(), x, z, tile, y);
        this.nodes.push(node);
        //console.log("Node info:", this.nodes.length - 1, x, z);
        //console.log("Function: ", this.getIndexFromCoords(x,z), x, z);
      }
    }
  }
  
  // Create tile-based edges
  createEdges() {
    // Loop over all rows and columns
    // to create all of our edges
    const xMax = this.tileArray.length;
    const zMax = this.tileArray[0][0].length;

    for (let x = 0; x < xMax; x++) {
      for (let z = 0; z < zMax; z++) {

        // The index of our current node
        let index = z + x * zMax;
        let current = this.nodes[index];

        // Check if the current node is traversable
        if (current.isTraversable()) {

          if (x > 0) {
            let west = this.nodes[index - zMax];
            current.tryAddEdge(west, 1, 3, this.canStair, this.canFly);
            if (current.edges.some(edge => edge.node === west))
            {
              west.addEdgeInto(current, 1); // Telling west current has an edge into it =)
            }
          }

          if (x < this.tileArray.length - 1) {
            let east = this.nodes[index + zMax];
            current.tryAddEdge(east, 1, 1, this.canStair, this.canFly);
            if (current.edges.some(edge => edge.node === east))
            {
              east.addEdgeInto(current, 1); // Telling east current has an edge into it =)
            }
          }

          if (z > 0) {
            let north = this.nodes[index - 1];
            current.tryAddEdge(north, 1, 0, this.canStair, this.canFly);
            if (current.edges.some(edge => edge.node === north))
            {
              north.addEdgeInto(current, 1); // Telling north current has an edge into it =)
            }
          }

          if (z < this.tileArray[0][0].length - 1) {
            let south = this.nodes[index + 1];
            current.tryAddEdge(south, 1, 2, this.canStair, this.canFly);
            if (current.edges.some(edge => edge.node === south))
            {
              south.addEdgeInto(current, 1); // Telling south current has an edge into it =)
            }
          }
        }
      }
    }
  }

  // Method to get a random ground node
  getRandomGroundNode() {
    // Filter for ground nodes
    let groundNodes = this.nodes.filter(node => node.type !== 'wall');
    
    if (groundNodes.length === 0) {
      console.log("No ground nodes available.");
      return null;
    }
    // Random index from the list of ground nodes
    let randomIndex = Math.floor(Math.random() * groundNodes.length);
    return groundNodes[randomIndex];
  }


  // Method to get a random ground node along the outside perimeter of the level
  getRandomEdgeNode()
  {
    let groundNodes = this.nodes.filter(node => node.type !== 'wall');
    let edgeNodes = groundNodes.filter(node => (
      (node.x === 1 || node.x === this.tileArray.length - 2)
      || (node.z === 1 || node.z === this.tileArray[0][0].length - 2)
      )
    );

    if (edgeNodes.length === 0)
    {
      console.log("No empty nodes along maze edge (THIS SHOULDN'T HAPPEN!)");
      return null;
    }

    let randIndex = Math.floor(Math.random() * edgeNodes.length);
    return edgeNodes[randIndex];
  }


  getIndexFromCoords(x, z) {
    return x*this.tileArray[0][0].length + z;
  }


  getGoals()
  {
    let goals = [];

    for (let i = 0; i < this.nodes.length; i++)
    {
      if (this.nodes[i].type === 'goal')
      {
        goals.push(this.nodes[i]);
      }
    }

    return goals;
  }


  // Takes an array of start nodes and returns a map of nodes and their costs to reach the
  // nearest goal.
  multiGoalDijkstra(goals) {
    // Initialise Dijkstra costs map and minheap
    let costs = new Map();
    let heap = new MinHeap();

    // Add goal nodes to map and heap
    goals.forEach((element) => {
      costs.set(element, 0);
      heap.enqueue({cost: 0, node: element});
    });

    // Propagate out from goals until all accessible nodes have been visited
    while (!heap.isEmpty()) {
      const { cost: currentCost, node: currentNode } = heap.dequeue();

      if (currentCost <= costs.get(currentNode)) {
        for (let edge of currentNode.edgesIn) {
          let neighbour = edge.node;
          let edgeCost = edge.cost;
          let totalCost = currentCost + edgeCost;

          // Update map and heap if an unexplored or cheaper path is found
          if (costs.get(neighbour) === undefined || totalCost < costs.get(neighbour)) {
            costs.set(neighbour, totalCost);
            heap.enqueue({ cost: totalCost, node: neighbour });
          }
        }
      }
    }

    return costs;
  }


  // Takes a set of """"goals"""" and finds the costs to get from them, rather than to
  reverseDijkstra(goals) {
    // Initialise Dijkstra costs map and minheap
    let costs = new Map();
    let heap = new MinHeap();

    // Add goal nodes to map and heap
    goals.forEach((element) => {
      costs.set(element, 0);
      heap.enqueue({cost: 0, node: element});
    });

    // Propagate out from goals until all accessible nodes have been visited
    while (!heap.isEmpty()) {
      const { cost: currentCost, node: currentNode } = heap.dequeue();

      if (currentCost <= costs.get(currentNode)) {
        for (let edge of currentNode.edges) {
          let neighbour = edge.node;
          let edgeCost = edge.cost;
          let totalCost = currentCost + edgeCost;

          // Update map and heap if an unexplored or cheaper path is found
          if (costs.get(neighbour) === undefined || totalCost < costs.get(neighbour)) {
            costs.set(neighbour, totalCost);
            heap.enqueue({ cost: totalCost, node: neighbour });
          }
        }
      }
    }

    return costs;
  }


  // Takes an array containing the goal nodes and returns a vector field
  setupVectorField(goals, reverse = false) {
    // Get costs map
    let costs = null;
    if (reverse) costs = this.reverseDijkstra(goals);
    else         costs = this.multiGoalDijkstra(goals);

    for (const node of this.nodes) {
      // Setting vector of goal nodes to zero vector
      if (goals.includes(node)) {
        this.vectorField.set(node.id, new THREE.Vector3(0, 0, 0));
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
        this.vectorField.set(node.id, new THREE.Vector3(0, 0, 0));
      } else {
        // Can access goal from this node -> find direction to node
        let currentPos = new THREE.Vector3(node.x, 5, node.z);
        let neighbourPos = new THREE.Vector3(bestNeighbour.x, 5, bestNeighbour.z);
        let direction = neighbourPos.clone().sub(currentPos).normalize();

        this.vectorField.set(node.id, direction);
      }
    }

    // Debug methods
    //let vectorFieldGraphics = this.mapRenderer.createVectorFieldRendering(this.vectorField);
    //this.gameObject.add(vectorFieldGraphics);

  }
}