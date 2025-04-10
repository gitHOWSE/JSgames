// Util/AdvancedAssetLoader.js
// AI GENERATED

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import manifest from "../models/meshManifest.js";

export class AdvancedAssetLoader {
  static MAX_CONCURRENT = 4;

  constructor(options = {}) {
    this.gltfLoader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.ktx2Loader = new KTX2Loader();

    this.dracoLoader.setDecoderPath(options.dracoPath || "/draco/");
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    this.ktx2Loader.setTranscoderPath(options.ktx2Path || "/basis/");
    this.gltfLoader.setKTX2Loader(this.ktx2Loader);

    this.cache = new Map();
    this.loading = new Map();
    this.queue = [];
    this.activeLoads = 0;

    this.onProgress = options.onProgress || (() => {});
    this.onError = options.onError || console.error;
  }

  load(name, url) {
    if (this.cache.has(name)) {
      return Promise.resolve(this.clone(name));
    }
    if (this.loading.has(name)) {
      return this.loading.get(name);
    }

    const promise = new Promise((resolve, reject) => {
      const task = () => {
        this.activeLoads++;
        this.gltfLoader.load(
          url,
          (gltf) => {
            this.cache.set(name, {
              scene: gltf.scene,
              animations: gltf.animations,
            });
            this.activeLoads--;
            this._dequeue();
            this.onProgress(name, true);
            resolve(this.clone(name));
          },
          (xhr) => {
            this.onProgress(name, xhr.loaded / xhr.total);
          },
          (err) => {
            this.activeLoads--;
            this._dequeue();
            this.onError(name, err);
            reject(err);
          },
        );
      };

      this.queue.push(task);
      this._dequeue();
    });

    this.loading.set(name, promise);
    return promise;
  }

  _dequeue() {
    while (
      this.activeLoads < AdvancedAssetLoader.MAX_CONCURRENT &&
      this.queue.length
    ) {
      const next = this.queue.shift();
      next();
    }
  }

  clone(name) {
    const entry = this.cache.get(name);
    if (!entry) throw new Error(`Asset ${name} not loaded`);
    return entry.scene.clone(true);
  }

  getClips(name) {
    const entry = this.cache.get(name);
    return entry ? entry.animations : [];
  }

  async loadAll() {
    const promises = manifest.map((file) => this.load(file.name, file.url));
    await Promise.all(promises);
  }

  unload(name) {
    if (!this.cache.has(name)) return;
    const { scene } = this.cache.get(name);
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material))
          obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
    this.cache.delete(name);
  }
}

export const assetLoader = new AdvancedAssetLoader({
  dracoPath: "/draco/",
  ktx2Path: "/basis/",
  onProgress: (n, p) =>
    console.log(
      `[Loader] ${n}: ${p === true ? "done" : (p * 100).toFixed(1) + "%"}`,
    ),
  onError: (n, e) => console.error(`[Loader] ${n} failed`, e),
});
