// robots/goo.js
import * as THREE from "three";
import { clone as SkeletonUtilsClone } 
  from "three/examples/jsm/utils/SkeletonUtils.js";  
import { Movement } from "../entities/Movement.js";
import { Item } from "../entities/Items.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { FlockBehaviour } from "../robots/behaviours.js";
import { cameraManager } from "../Util/Camera.js";
import manifest from "../models/meshManifest.js";

// JAMES: Names of the animations we care about.
const clipNames = [
  "gooAgreeGesture",
  "gooBackRightRun",
  "gooRunning",
  "gooWalking"
];

export class Goo extends Entity {
  constructor({ scene, position, tag = "goo" } = {}) {
    super({ scene, position, tag });

    // JAMES: Robot setup.
    this.is_robot = true;
    this.is_hackable = true;
    this.movement = new Movement("wheels", 12, 2);
    this.setMovable(true);
    this.item = new Item();

    this.mixer = null;
    this.clips = [];

    // JAMES: Load & cache model + animations.
    const entry = manifest.find(m => m.name === "gooBot");
    assetLoader.load("gooBot", entry.url)
      .then(() => {
        // JAMES: Clone raw model from cache.
        const raw = assetLoader.clone("gooBot");
        // JAMES: Wrap in SkeletonUtils to keep bone UUIDs.
        const gooModel = SkeletonUtilsClone(raw);
        gooModel.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI);

        // JAMES: Attach to entity.
        this.mesh = gooModel;
        this.model.add(gooModel);

        // JAMES: Create mixer on our clone.
        this.mixer = new THREE.AnimationMixer(gooModel);

        // JAMES: Grab only the clips we need.
        this.clips = clipNames
          .map(name => assetLoader.getClips(name)?.[0])
          .filter(Boolean);

        // JAMES: Start a random clip.
        if (this.clips.length > 0) {
          const chosen = this.clips[
            Math.floor(Math.random() * this.clips.length)
          ];
          const action = this.mixer.clipAction(chosen, gooModel);
          action.setLoop(THREE.LoopRepeat);
          action.play();
        }
      })
      .catch(err => console.error("JAMES: Failed to load gooBot model", err));

    this.behaviour = new FlockBehaviour(this, {
      neighbors: [], neighborRadius: 10,
      alignmentWeight: 1.0, cohesionWeight: 1.0,
      separationWeight: 1.5
    });
  }

  update(delta) {
    // JAMES: Update flock neighbors.
    this.behaviour.neighbors = entityManager
      .getEntities()
      .filter(e => e !== this && e.is_robot && e.name === "goo");

    // JAMES: Compute & apply steering.
    const steer = this.behaviour.calculate(delta);
    steer.clampLength(0, this.movement.maxForce);
    this.movement.acceleration.add(steer);

    // JAMES: Advance animations (delta ms → seconds).
    if (this.mixer) {
      this.mixer.update(delta * 0.001);
    }

    // JAMES: Call base update with seconds.
    super.update(delta * 0.001);
  }
}


export async function createGoo(position) {
  try {

    // JAMES: Instantiate and register.
    const goo = new Goo({ scene: cameraManager.scene, position });
    entityManager.addEntity(goo);
    return goo;
  } catch (error) {
    console.error("JAMES: Error creating goo robot", error);
    throw error;
  }
}
