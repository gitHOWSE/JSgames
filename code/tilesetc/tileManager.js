// code/tilesetc/tileManager.js
//JAMES: This module manages tile entities (floors, walls, ramps, steps, etc.) in the game.
//JAMES: The TileManager maintains an internal list of registered tiles and a lookup map by tile type.
//JAMES: Tiles are added asynchronously by returning a Promise that resolves as soon as they are registered.
//JAMES: The update(delta) method is called each frame (or at a throttled rate) to call update(delta) on all tiles.

export class TileManager {
  /**
   * @param {number} updateIntervalFrames — Number of frames between tile.update() calls.
   */
  constructor(updateIntervalFrames = 10) {
    //JAMES: How frequently to call each tile’s update(delta) method.
    this.updateIntervalFrames = updateIntervalFrames;

    //JAMES: Main list of tiles currently managed.
    this.tiles = [];

    //JAMES: Map from tile type (constructor name) to an array of tiles.
    this.tileMap = new Map();

    //JAMES: Frame counter used for throttling update calls.
    this.frameCount = 0;
  }

  /**
   * JAMES: Immediately registers a tile entity for updates.
   *       Returns a Promise that resolves once the tile is added to the manager.
   * @param {Object} tileEntity — An object implementing update(delta)
   * @returns {Promise<Object>} — Resolves to the tileEntity once registered.
   */
  async addTile(tileEntity) {
    return new Promise((resolve) => {
      //JAMES: Immediately add the tile to the main list.
      this.tiles.push(tileEntity);

      //JAMES: Compute the type key from the tile’s constructor name.
      const type = this._getTileType(tileEntity);

      //JAMES: Add the tile to the type map; create a new array if needed.
      if (!this.tileMap.has(type)) {
        this.tileMap.set(type, [tileEntity]);
      } else {
        this.tileMap.get(type).push(tileEntity);
      }

      console.log(
        `JAMES: Added tile of type '${type}'. Total tiles: ${this.tiles.length}`,
      );
      resolve(tileEntity);
    });
  }

  /**
   * JAMES: Unregisters a tile entity.
   *       Returns a Promise that resolves to the tileEntity if removal is successful,
   *       or null if not found.
   * @param {Object} tileEntity
   * @returns {Promise<Object|null>}
   */
  async removeTile(tileEntity) {
    return new Promise((resolve) => {
      //JAMES: Remove the tile from the main list.
      this.tiles = this.tiles.filter((t) => t !== tileEntity);

      //JAMES: Remove from the type map as well.
      const type = this._getTileType(tileEntity);
      if (this.tileMap.has(type)) {
        this.tileMap.set(
          type,
          this.tileMap.get(type).filter((t) => t !== tileEntity),
        );
      }

      if (this.tiles.indexOf(tileEntity) === -1) {
        console.log(
          `JAMES: Removed tile of type '${type}'. Total tiles: ${this.tiles.length}`,
        );
        resolve(tileEntity);
      } else {
        console.error("JAMES: removeTile failed — tile not found:", tileEntity);
        resolve(null);
      }
    });
  }

  /**
   * JAMES: Returns all managed tiles, or only those of a specified type.
   * @param {string} [type] — e.g., "Wall", "Floor", "Ramp", "Steps"
   * @returns {Array<Object>}
   */
  getTiles(type) {
    if (type === undefined) {
      return this.tiles;
    }
    return this.tileMap.get(type) || [];
  }

  /**
   * JAMES: Called once per frame from the game loop.
   *       Increments an internal frame counter and, on every updateIntervalFrames,
   *       calls update(delta) on each registered tile.
   * @param {number} delta — Time elapsed since the last frame.
   */
  update(delta) {
    //JAMES: Increment the frame counter.
    this.frameCount++;

    //JAMES: Throttle tile updates so that update(delta) is only called every updateIntervalFrames frames.
    if (this.frameCount % this.updateIntervalFrames !== 0) {
      return;
    }

    //JAMES: Call update(delta) on each tile.
    for (const tile of this.tiles) {
      if (tile && typeof tile.update === "function") {
        tile.update(delta);
      }
    }
  }

  /**
   * JAMES: Helper function to determine the tile’s type key.
   *       By default, it uses the constructor name.
   * @param {Object} tileEntity
   * @returns {string}
   */
  _getTileType(tileEntity) {
    return tileEntity.constructor.name;
  }
}

//JAMES: Export a singleton instance so the game can use one shared TileManager.
export const tileManager = new TileManager();
