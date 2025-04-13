// code/explosives/onwall.js
//JAMES: A hackable on‑wall object, using a random low‑poly asset or one you specify.

import * as THREE from "three";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";

//JAMES: Configuration for each low‑poly on‑wall asset.
const LOWPOLY_ONWALL_CONFIG = {
  accessTerminalLow: { scale: new THREE.Vector3(1.5, 1.5, 1.5), offsetY: 0.5 },
  espressoDreamerLow: { scale: new THREE.Vector3(1.5, 1.5, 1.5), offsetY: 0.5 },
};

//JAMES: List of asset keys for random selection
export const LOWPOLY_ONWALL_KEYS = Object.keys(LOWPOLY_ONWALL_CONFIG);

//JAMES: Fallback if no config found
const DEFAULT_SCALE = new THREE.Vector3(1, 1, 1);

export class OnwallLow extends Entity {
  /**
   * @param {string} assetName   key in meshManifest
   * @param {THREE.Vector3} position
   * @param {THREE.Scene} scene
   */
  constructor(assetName, position, scene) {
    //JAMES: Give it 1 HP so a hack disables it.
    super({ tag: "onwall", max_health: 1, position });
    this.is_hackable = true;
    this.is_robot = false;

    //JAMES: Clone the low‑poly mesh
    const mesh = assetLoader.clone(assetName);

    //JAMES: Apply per‑asset scale (or default)
    const cfg = LOWPOLY_ONWALL_CONFIG[assetName] || {};
    mesh.scale.copy(cfg.scale || DEFAULT_SCALE);

    //JAMES: Compute bounding box *after* scaling, to align the mesh
    const bbox = new THREE.Box3().setFromObject(mesh);
    //JAMES: Move mesh so its lowest point sits on y = offsetY (wall height)
    mesh.position.y = (cfg.offsetY || 0) - bbox.min.y;

    //JAMES: Apply X/Z from the requested world position
    mesh.position.x = position.x;
    mesh.position.z = position.z;

    //JAMES: Use this mesh as the entity’s visual root
    this.model = mesh;

    //JAMES: Add to scene & entity manager
    scene.add(this.model);
    entityManager.addEntity(this);
  }
}

/**
 * Spawn a random low‑poly on‑wall object at `position` in `scene`.
 * @param {THREE.Vector3} position
 * @param {THREE.Scene} scene
 * @returns {OnwallLow}
 */
export function createRandomOnwallLow(position, scene) {
  const idx = Math.floor(Math.random() * LOWPOLY_ONWALL_KEYS.length);
  const assetName = LOWPOLY_ONWALL_KEYS[idx];
  return new OnwallLow(assetName, position, scene);
}
