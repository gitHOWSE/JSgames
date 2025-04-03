import { Entity } from "./Entity.js";

class EntityManager {
  constructor() {
    this.entities = [];          // Stores all entities
    this.entitiesToAdd = [];     // To prevent iterator invalidation
    this.entityMap = new Map();  // Maps entities by tag so manager can give all entities of a tag
  }

  // Updates the entities and entityMap to only include entities with positive health.
  removeDeadEntities() {
    // Remove dead entities from the main entities array
    this.entities = this.entities.filter(e => e.getHealth() > 0);

    // Remove dead entities from the map
    this.entityMap.forEach((arr, key) => { 
      this.entityMap.set(key, arr.filter(e => e.getHealth() > 0));
    });
  }

  update() {
    // Add new entities from entitiesToAdd to the main entities array and update entityMap.
    for (let e of this.entitiesToAdd) {
      this.entities.push(e);
      const tag = e.getTag();
      if (!this.entityMap.has(tag)) {
        this.entityMap.set(tag, [e]);
      } else {
        this.entityMap.get(tag).push(e);
      }
    }

    // Clear the temporary list once all new entities have been added.
    this.entitiesToAdd.length = 0;

    // Remove dead entities from both entities and entityMap.
    this.removeDeadEntities();
  }

  // Adds an entity. If optional parameters are provided, they are passed to the Entity constructor.
  addEntity(tag, max_health, max_charge, movement, item) {
    let entity;
    if (max_health === undefined) {
      entity = new Entity(tag);
    } else {
      entity = new Entity(tag, max_health, max_charge, movement, item);
    }
    this.entitiesToAdd.push(entity);
    return entity;
  }

  // Returns an array of entities. If a tag is provided, returns only entities with that tag.
  getEntities(tag) {
    if (tag === undefined) {
      return this.entities;
    } else {
      return this.entityMap.get(tag) || [];
    }
  }
}

// Create and export a singleton instance of EntityManager.
const entityManagerInstance = new EntityManager();
export default entityManagerInstance;