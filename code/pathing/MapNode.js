import { Tile } from '/mapGeneration/Tile.js';

export class MapNode
{
	constructor(id, x, z, tile, height = 0)
	{
		this.id = id;
		this.x = x;
		this.z = z;
		this.type = tile.getType();
		this.facing = tile.getFacing();
		this.height = height;
		this.edges = [];
		this.edgesIn = [];
	}

	// Adds an edge from this to node
	addEdge(node, cost)
	{
		this.edges.push({node: node, cost: cost});
	}

	// Lets this know that node has an edge pointing to this
	addEdgeInto(node, cost)
	{
		this.edgesIn.push({node: node, cost: cost});
	}

	isTraversable()
	{
		return this.type !== 'wall' && this.type !== 'floor';
	}

	tryAddEdge(node, cost, dir2node, canStair = false, canFly = false)
	{
		const oppDir = (dir) => (dir + 2) % 4; // Gets opposite (parallel) direction

		let canLeave = false; // can leave current position in dir2node
		let canEnter = false;  // can enter node from current position

		// Checking if we can leave
		if (this.isTraversable())
		{
			if (canFly) // We can always leave by flight
			{
				canLeave = true;
			}
			else
			{
				if (this.type === 'cliff') // NOTE: this means you are standing at the bottom
				{
					// Can go anywhere from the bottom of a cliff except its top
					if (node.height <= this.height) canLeave = true;
				}
				else if (this.type === 'stair')
				{
					// Can always descend stairs, or hop off sides (if side terrain is lower)
					if (node.height <= this.height) canLeave = true
					// Can ascend stairs if canStair
					else if (dir2node === this.facing && canStair) canLeave = true;
				}
				else if (this.type === 'ramp')
				{
					// Can always descend ramps, or hop off sides (if side terrain is lower)
					if (node.height <= this.height) canLeave = true;
					// Can ascend and descend ramp along its facing direction
					else if (dir2node === this.facing
						|| dir2node === oppDir(this.facing))
					{
						canLeave = true;
					}
				}
				else canLeave = true; // Terrain has no special movement restrictions on exit
			}
		}

		// Checking if we can enter
		if (node.isTraversable())
		{
			if (canFly)
			{
				canEnter = true;
			}
			else
			{
				// NOTE ON STAIRS/RAMPS: can never enter from the side without flying
				if (node.type === 'stair')
				{
					// Can enter a stair from below if canStair
					if (dir2node === node.facing && canStair) canEnter = true;
					// Can always enter a stair from above
					else if (dir2node === oppDir(node.facing)) canEnter = true;
					// Can enter stairs from the sides if we are above the stairs
					else if (this.height > node.height) canEnter = true;
				}
				else if (node.type === 'ramp')
				{
					// Can enter a ramp from below and above
					if (dir2node === node.facing) canEnter = true;
					else if (dir2node === oppDir(node.facing)) canEnter = true;
					// Can enter ramps from the sides if we are above the stairs
					else if (this.height > node.height) canEnter = true;
				}
				else canEnter = true; // Terrain has no special movement restrictions on entry
			}
		}

		// Add edge only if we can leave current pos in dir2node and enter node from current pos
		if (canLeave && canEnter)
		{
			this.addEdge(node, cost);
			return true;
		}
		return false;
	}
}