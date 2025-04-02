import Entity from "Entity.js";

class EntityManager
{
	constructor()
	{
		this.entities = [];			// Stores all entities
		this.entitiesToAdd = [];	// To prevent iterator invalidation
		this.entityMap = new Map();		// Maps entities by tag so manager can give all entities of tag
		this.size = 0;
	}

	// Updates entity array to only include entities with positive HP
	removeDeadEntities(entityArray)
	{
		// Removing dead entities from entity array
		entities = entities.filter(e => e.getHealth() > 0);

		// Removing dead entities from entityMap
		entityMap.forEach((array, key) => { 
			entityMap.set(key, array.filter(e => e.getHealth() > 0));
			});
	}

	update()
	{
		// Add new entities to entity list and create entries for their tags
		for (let e of entitiesToAdd)
		{
			entities.push(e);
			tagArr = entityMap.get(e.getTag());
			if (tagArr === undefined)
			{
				entityMap.set(e.getTag(), [e]);
			}
			else
			{
				entityMap.get(e.getTag()).push(e);
			}
		}

		// Clear toAdd since the entities have been added
		entitiesToAdd.clear();

		// Remove dead entities
		removeDeadEntities();
	}

	// Use this to create entities...
	addEntity(tag)
	{
		let entity = new Entity(tag);
		this.entitiesToAdd.push(entity);
		return entity;
	}

	// Or this.
	addEntity(tag, max_health, max_charge, movement, item)
	{
		let entity = new Entity(tag, max_health, max_charge, movement, item);
		this.entitiesToAdd.push(entity);
		return entity;
	}

	// Returns an array with ALL entities
	getEntities()
	{
		return this.entities;
	}

	// Returns an array of all entities with tag
	getEntities(tag)
	{
		if (entityMap.get(tag) === undefined)
		{
			return [];
		}
		else
		{
			return entityMap.get(tag);
		}
	}
}