// levels/levelone.js

"use strict";

//JAMES: Import Three.js core and our camera manager.
import * as THREE from "three";
import { cameraManager } from "../Util/Camera.js";

//JAMES: Import our vacuum factory and floor entity.
import { createVacuum } from "../robots/vacuum.js";
import Floor from "../tilesetc/floor.js";

//JAMES: Import our new animation helper.
import { playAnimation } from "../Util/AnimationUtils.js";

//JAMES: We'll keep track of the player and all mixers here.
let vacuum = null;
const mixers = [];
const clock = new THREE.Clock();

//JAMES: Path to the forklift sword‑judgment animation.
const GLB_URL =
  "/models/lowpoly/animations/forklift/Animation_Sword_Judgment_withSkin.glb";

export async function startLevelOne() {
  try {
    //JAMES: 1) Spawn the vacuum player, set up camera follow, and add to scene.
    vacuum = await createVacuum(new THREE.Vector3(0, 0, 0));
    vacuum.makePlayer();

    cameraManager.scene.add(vacuum.model);

    //JAMES: 2) Instantiate a Floor entity (we only needed it to load the tile)
    const tempFloor = new Floor({ scene: cameraManager.scene });
    await waitForModelLoad(tempFloor);
    cameraManager.scene.remove(tempFloor.model);

    //JAMES: 3) Play the forklift animation via our helper.
    playAnimation({
      url: GLB_URL,
      scene: cameraManager.scene,
      mixers,
      position: new THREE.Vector3(0, 0, -5),
      scale: new THREE.Vector3(6, 6, 6), // adjust size if needed
      playbackRate: 1, // 1 = normal speed
      loop: THREE.LoopRepeat,
      loopCount: Infinity,
    });

    //JAMES: 4) Start the render + update loop.
    animate();
  } catch (err) {
    console.error("Error in startLevelOne:", err);
  }
}

//JAMES: Per‑frame render/update loop.
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (vacuum && vacuum.update) vacuum.update(delta);

  //JAMES: Advance all animation mixers.
  mixers.forEach((m) => m.update(delta));

  //JAMES: Render the scene from our main camera.
  cameraManager.renderer.render(cameraManager.scene, cameraManager.camera);
}

//JAMES: Helper to wait until the Floor model has at least one child.
function waitForModelLoad(floor) {
  return new Promise((resolve) => {
    const check = () => {
      if (floor.model && floor.model.children.length) resolve();
      else setTimeout(check, 10);
    };
    check();
  });
}
