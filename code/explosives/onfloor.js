// explosives/onfloor.js
//JAMES: A hackable on‑floor object, using a random low‑poly asset or one you specify.

import * as THREE from "three";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";

//JAMES: Configuration for each low‑poly on‑floor asset.
//      Tweak scale & optional offsetY per model for best fit.
const LOWPOLY_ONFLOOR_CONFIG = {
  blueFridgeLow: { scale: new THREE.Vector3(1.7, 2.5, 1.7) },
  mysteryBoxLow: { scale: new THREE.Vector3(2.0, 2.0, 2.0) },
  oldSchoolTowerLow: { scale: new THREE.Vector3(3.5, 3.0, 1.5) },
  snackMachineLow: { scale: new THREE.Vector3(3.7, 3.7, 3.7) },
  storageCabinetLow: { scale: new THREE.Vector3(1.7, 3.3, 1.7) },
  vintageOscilloscopeLow: { scale: new THREE.Vector3(0.8, 0.8, 0.8) },
};

//JAMES: List of asset keys for random selection
export const LOWPOLY_ONFLOOR_KEYS = Object.keys(LOWPOLY_ONFLOOR_CONFIG);

//JAMES: Fallback if no config found
const DEFAULT_SCALE = new THREE.Vector3(1, 1, 1);

export class OnfloorLow extends Entity {
  /**
   * @param {string} assetName  — key in meshManifest
   * @param {THREE.Vector3} position
   * @param {THREE.Scene} scene
   */
  constructor(assetName, position, scene) {
    //JAMES: Give it 1 HP so a hack kills it.
    super({ tag: "onfloor", max_health: 1, position });
    this.is_hackable = true;
    this.is_robot = false;

    //JAMES: Clone the low‑poly mesh
    const mesh = assetLoader.clone(assetName);

    //JAMES: Apply per‑asset scale (or default)
    const cfg = LOWPOLY_ONFLOOR_CONFIG[assetName] || {};
    mesh.scale.copy(cfg.scale || DEFAULT_SCALE);

    //JAMES: Compute bounding box *after* scaling, to ground the mesh
    const bbox = new THREE.Box3().setFromObject(mesh);
    //JAMES: Move mesh up so its lowest point sits on y=0
    mesh.position.y = -bbox.min.y + (cfg.offsetY || 0);

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
 * Spawn a random low‑poly on‑floor object at `position` in `scene`.
 * @param {THREE.Vector3} position
 * @param {THREE.Scene} scene
 * @returns {OnfloorLow}
 */
export function createRandomOnfloorLow(position, scene) {
  const idx = Math.floor(Math.random() * LOWPOLY_ONFLOOR_KEYS.length);
  const assetName = LOWPOLY_ONFLOOR_KEYS[idx];
  return new OnfloorLow(assetName, position, scene);
}
