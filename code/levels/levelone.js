// levels/levelone.js
"use strict";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cameraManager } from "../Util/Camera.js";
import { createVacuum } from "../robots/vacuum.js";
import Floor from "../tilesetc/floor.js";

let vacuum = null;
const mixers = [];
const clock  = new THREE.Clock();

// Path to your single GLB
const GLB_URL = "/models/lowpoly/animations/forklift/Animation_Sword_Judgment_withSkin.glb";

export async function startLevelOne() {
  try {
    // 1) Set up vacuum & floor as before
    vacuum = await createVacuum(new THREE.Vector3(0, 0, 0));
    vacuum.makePlayer();
    cameraManager.scene.add(vacuum.mesh);

    const tempFloor = new Floor({ scene: cameraManager.scene });
    await waitForModelLoad(tempFloor);
    cameraManager.scene.remove(tempFloor.model);

    // 2) Load the animated GLB via GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
      GLB_URL,
      (gltf) => {
        // Add the model to the scene
        const model = gltf.scene;
        model.position.set(0, 0, -5);
        cameraManager.scene.add(model);



        // 4) Create a mixer and play the first clip
        const mixer = new THREE.AnimationMixer(model);
        const clip  = gltf.animations[0];
        const action = mixer.clipAction(clip);
        action.play();

        mixers.push(mixer);
      },
      (xhr) => {
        console.log(`Loading GLB: ${(xhr.loaded / xhr.total * 100).toFixed(1)}%`);
      },
      (err) => {
        console.error("Error loading GLB:", err);
      }
    );

    // 5) Kick off the render loop
    animate();
  } catch (err) {
    console.error("Error in startLevelOne:", err);
  }
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (vacuum && vacuum.update) vacuum.update(delta);
  mixers.forEach((m) => m.update(delta));

  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}

// Helper to wait until the floor model is in the scene
function waitForModelLoad(floor) {
  return new Promise((resolve) => {
    const check = () => {
      if (floor.model && floor.model.children.length) resolve();
      else setTimeout(check, 10);
    };
    check();
  });
}
