// Util/Resources.js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * The purpose of this class is to load
 * resources into your three.js project.
 * Resources can be accessed through a dictionary "dict".
 */
export class Resources {
  constructor(files) {
    this.files = files;
    this.dict = {};
    this.gltfLoader = new GLTFLoader();
  }

  get(key) {
    // Return a clone of the stored mesh.
    return this.dict[key].clone();
  }

  // Loads all specified resources via their URLs.
  async loadAll() {
    let promises = [];
    this.files.forEach((file) => {
      let promise = this.loadGLTF(file.name, file.url).then(([name, data]) => {
        this.dict[name] = data;
      });
      promises.push(promise);
    });
    return Promise.all(promises);
  }

  // Load GLB or GLTF files.
  loadGLTF(name, url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (data) => resolve([name, data.scene]),
        null,
        reject,
      );
    });
  }

  /**
   * Static method to load resources from a JSON manifest.
   * @param {string} manifestUrl - The URL of the JSON manifest.
   * @returns {Promise<Resources>} - A promise that resolves to a loaded Resources instance.
   */
  static async loadFromManifest(manifestUrl) {
    const response = await fetch(manifestUrl);
    const text = await response.text();
    console.log("Manifest text:", text);
    try {
      const files = JSON.parse(text);
      const resources = new Resources(files);
      await resources.loadAll();
      return resources;
    } catch (err) {
      console.error("Error parsing JSON manifest:", err);
      throw err;
    }
  }
  /**
   * Static method that returns a clone of the mesh specified by key from the manifest.
   * It internally caches the loaded Resources instance so subsequent calls use the same cache.
   * @param {string} key - The key (alias) for the desired model.
   * @returns {Promise<THREE.Object3D>} - A promise that resolves to the cloned mesh.
   */
  static async cloneFromManifest(key) {
    // Use a static cache to store the loaded resources.
    if (!Resources._instance) {
      // Replace the manifest URL below as needed.
      Resources._instance = await Resources.loadFromManifest(
        "/json/meshManifest.json",
      );
    }
    return Resources._instance.get(key);
  }
}
