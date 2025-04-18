// robots/projectiles.js
import * as THREE from "three";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { tileManager } from "../tilesetc/tileManager.js";
import { getTileCenter, TILE_SIZE_XZ } from "../levels/levelSetup.js"; // JAMES: Import tile constants and helper.

/**
 * JAMES: Straight‑line projectile fired from a turret muzzle.
 */
export class Projectile extends Entity {
  constructor({
    scene,
    reference,
    initialPosition,
    direction,
    speed = 75,
    lifetime = 4,
  }) {
    super({ scene });

    if (!reference || !initialPosition || !direction) {
      throw new Error(
        "Projectile needs reference, initialPosition, and direction"
      );
    }

    // JAMES: Track reference frame, lifetime and age.
    this.reference = reference;
    this.lifetime  = lifetime;
    this.age       = 0;

    // JAMES: Sphere radius = half‑diagonal of tile square.
    this.damageRadius = TILE_SIZE_XZ/3 ; // Math.SQRT1_2;
    // JAMES: Damage per entity.
    this.damageAmount = 35;

    // JAMES: Convert initialPosition into reference‑local coords.
    this.relativePosition = reference.worldToLocal(initialPosition.clone());

    // JAMES: Build local velocity vector.
    const localDir = reference
      .worldToLocal(reference.position.clone().add(direction))
      .sub(reference.position)
      .normalize();
    this.velocityLocal = localDir.multiplyScalar(speed);

    // JAMES: Visual mesh for the projectile.
    const geometry = new THREE.SphereGeometry(0.15, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.model.add(this.mesh);

    // JAMES: Align +Z to firing direction.
    const forward = new THREE.Vector3(0, 0, 1);
    const quat    = new THREE.Quaternion().setFromUnitVectors(forward, direction);
    this.model.quaternion.copy(quat);

    this._syncToWorld();
  }

  // JAMES: Sync the model’s world position from relativePosition.
  _syncToWorld() {
    this.model.position.copy(
      this.reference.localToWorld(this.relativePosition.clone())
    );
  }

  // JAMES: Move each frame and detect impacts.
  update(delta) {
    this.relativePosition.addScaledVector(this.velocityLocal, delta);
    this._syncToWorld();
    this.age += delta;

    const pos = this.model.position;

    // JAMES: Did we hit a tile?
    const hitTile = tileManager.getTileAt(pos.x, pos.z);
    if (hitTile) {
      this._explodeOnStory(hitTile);
      return;
    }

    // JAMES: Check direct entity collision.
    for (const e of entityManager.getEntities()) {
      if (e === this) continue;
      const d = pos.distanceTo(e.getWorldPosition(new THREE.Vector3()));
      if (d < 0.5) {
        this._explodeOnStory(tileManager.getTileAt(pos.x, pos.z));
        break;
      }
    }

    // JAMES: Auto‑kill if we exceed lifetime.
    if (this.age >= this.lifetime) {
      this.health = 0;
    }
  }

  // JAMES: Spawn one sphere per floor/wall tile on impacted story and deal damage.
  _explodeOnStory(tile) {
    // JAMES: Grab the story level of the tile we hit.
    const storyLevel = tile.story;

    // JAMES: Filter all tiles for floor/wall on that same story.
    const relevant = tileManager
      .getTiles()
      .filter(t => {
        const type = t.type;
        return t.story === storyLevel && (type === "floor" || type === "wall");
      });

    // JAMES: For each tile, compute its center and damage entities in that sphere.
    for (const t of relevant) {
      const center = getTileCenter(t.gridX, t.gridZ, t.story);
      for (const e of entityManager.getEntities()) {
        if (e === this) continue;
        const dist = center.distanceTo(e.getWorldPosition(new THREE.Vector3()));
        if (dist <= this.damageRadius && typeof e.damage === "function") {
          e.damage(this.damageAmount);
        }
      }
    }

    // JAMES: Self‑destruct once all splash damage is applied.
    this.health = 0;
    this.destroy();
  }

  // JAMES: Clean up mesh and unregister from EntityManager.
  destroy() {

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();

  }
}
