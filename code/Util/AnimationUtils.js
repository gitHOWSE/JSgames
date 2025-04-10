// Util/AnimationUtils.js

//JAMES: Import Three.js core and the GLTFLoader for loading glTF files.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

//JAMES: Create a single GLTFLoader instance to reuse for all animations.
const gltfLoader = new GLTFLoader();

/**
 * JAMES: Loads a glTF animation, adds it to the scene, creates a mixer,
 *       plays the first clip with the given options, and registers the
 *       mixer so it can be updated each frame.
 *
 * @param {Object} options
 * @param {string} options.url         — URL to the .glb file
 * @param {THREE.Scene} options.scene  — Three.js scene to add the model to
 * @param {Array<THREE.AnimationMixer>} options.mixers
 *        — Array to push the new mixer into for per-frame updates
 * @param {THREE.Vector3} [options.position]
 *        — Position to place the model at (default 0,0,0)
 * @param {THREE.Vector3} [options.scale]
 *        — Scale to apply to the model (default 1,1,1)
 * @param {THREE.Euler} [options.rotation]
 *        — Rotation to apply to the model (default 0,0,0)
 * @param {number} [options.playbackRate]
 *        — Speed of playback; negative for reverse (default 1)
 * @param {number} [options.loop]
 *        — Loop mode (e.g. THREE.LoopRepeat) (default THREE.LoopRepeat)
 * @param {number} [options.loopCount]
 *        — Number of times to loop (default Infinity)
 */
export function playAnimation({
  url,
  scene,
  mixers,
  position = new THREE.Vector3(0, 0, 0),
  scale = new THREE.Vector3(1, 1, 1),
  rotation = new THREE.Euler(0, 0, 0),
  playbackRate = 1,
  loop = THREE.LoopRepeat,
  loopCount = Infinity,
}) {
  //JAMES: Kick off the glTF load
  gltfLoader.load(
    url,
    (gltf) => {
      //JAMES: On success, grab the scene graph and apply transforms
      const model = gltf.scene;
      model.position.copy(position);
      model.scale.copy(scale);
      model.rotation.copy(rotation);

      //JAMES: Add the model to the world
      scene.add(model);

      //JAMES: Create an AnimationMixer for this model
      const mixer = new THREE.AnimationMixer(model);

      //JAMES: Play the first animation clip, with loop and playback rate
      if (gltf.animations.length) {
        mixer
          .clipAction(gltf.animations[0])
          .setLoop(loop, loopCount)
          .setEffectiveTimeScale(playbackRate)
          .play();
      } else {
        console.warn(`No animations found in ${url}`);
      }

      //JAMES: Remember to update this mixer each frame
      mixers.push(mixer);
    },
    (xhr) => {
      //JAMES: Log loading progress
      console.log(
        `Loading ${url}: ${((xhr.loaded / xhr.total) * 100).toFixed(1)}%`,
      );
    },
    (err) => {
      //JAMES: Log any errors
      console.error(`Error loading ${url}:`, err);
    },
  );
}
