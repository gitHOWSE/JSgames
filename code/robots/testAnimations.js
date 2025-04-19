// robots/testAnimations.js
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { clone as cloneModel } from "three/examples/jsm/utils/SkeletonUtils.js";

//JAMES: Dog-only animation test using FBX files (scaled up)
export async function spawnTestAnimations(scene) {
  const loader = new FBXLoader();
  const mixers = [];

    const dogFbx = await loader.loadAsync(
    "/models/lowpoly/animations/dog/Character_output.fbx"
  );
  const dogMesh = cloneModel(dogFbx);
  dogMesh.scale.setScalar(8);
  scene.add(dogMesh);

  const animFbx = await loader.loadAsync(
    "/models/lowpoly/animations/dog/model_Animation_Walking_withSkin.fbx"
  );

  if (animFbx.animations && animFbx.animations.length > 0) {
    const mixer = new THREE.AnimationMixer(dogMesh);
    mixers.push(mixer);
    mixer.clipAction(animFbx.animations[0]).play();
  }

  return mixers;
}