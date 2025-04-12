// code/tilesetc/steps.js
//JAMES: This class defines a Steps object that extends Entity.
//JAMES: The steps use their geometry and local bounding box to determine their XZ footprint.
//JAMES: When an entity is within that footprint, the steps adjust its Y position based on its
//JAMES: local Z-axis position on the steps. Entities without legs are only allowed to descend;
//JAMES: if they attempt to ascend, they are bounced back like with a wall collision.

import * as THREE from "three";
import { assetLoader } from "../Util/AdvancedAssetLoader.js";
import { Entity } from "../entities/Entity.js";
import entityManager from "../entities/EntityManager.js";

export default class Steps extends Entity {
  /**
   * @param {Object} options
   * @param {THREE.Scene} options.scene   — Scene to which the steps are added.
   * @param {number} [options.x=0]        — World X position.
   * @param {number} [options.z=0]        — World Z position.
   * @param {number} [options.story=0]    — Building story (vertical stack).
   */
  constructor({ scene, x = 0, z = 0, story = 0 } = {}) {
    //JAMES: Base Entity init (id, tag, boundingBox, etc.).
    super({ scene });

    this.setMovable(false);
    //JAMES: Create and add the mesh group.
    this.model = new THREE.Group();
    scene.add(this.model);

    //JAMES: Clone and scale the steps mesh.
    const stepsMesh = assetLoader.clone("steps");
    this.model.add(stepsMesh);
    this.model.scale.set(6, 5, 6);

    //JAMES: Compute initial bounding box and size.
    this.boundingBox = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    this.boundingBox.getSize(size);

    //JAMES: Align bottom at y=0 (minus any base offset).
    const baseOffsetY = -this.boundingBox.min.y - 4;
    const storyOffsetY = story * size.y;
    this.model.position.set(x, baseOffsetY + storyOffsetY, z);
  }

  //JAMES: Rotation helpers:
  rotateX90() {
    this.model.rotation.x += Math.PI / 2;
  }
  rotateY90() {
    this.model.rotation.y += Math.PI / 2;
  }
  rotateZ90() {
    this.model.rotation.z += Math.PI / 2;
  }

  /**
   * JAMES: Per-frame update.
   */
  update(delta) {
    //JAMES: Recompute world-space bounding box.
    const worldBBox = new THREE.Box3().setFromObject(this.model);

    //JAMES: Convert to local-space box.
    const localMin = this.model.worldToLocal(worldBBox.min.clone());
    const localMax = this.model.worldToLocal(worldBBox.max.clone());
    const localBox = new THREE.Box3(localMin, localMax);

    //JAMES: Determine world-space slope direction (local -Z axis).
    const worldQuat = new THREE.Quaternion();
    this.model.getWorldQuaternion(worldQuat);
    const slopeDir = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(worldQuat)
      .normalize();

    //JAMES: Loop over all entities.
    for (const ent of entityManager.getEntities()) {
      if (ent.id === this.id || !ent.getMovable()) continue;

      //JAMES: Entity position in local step space.
      const localPos = this.model.worldToLocal(ent.position.clone());

      if (
        localPos.x >= localBox.min.x &&
        localPos.x <= localBox.max.x &&
        localPos.z >= localBox.min.z &&
        localPos.z <= localBox.max.z
      ) {
        //JAMES: Interpolation factor along steps.
        const t =
          (localPos.z - localBox.min.z) / (localBox.max.z - localBox.min.z);

        //JAMES: Compute target local Y.
        const targetLocalY = THREE.MathUtils.lerp(
          localBox.max.y,
          localBox.min.y,
          t,
        );

        //JAMES: Desired world Y.
        const desiredY = this.model.position.y + targetLocalY;

        //JAMES: Check legs capability.
        if (!ent.has_legs) {
          //JAMES: If descending or on same level, allow.
          if (desiredY <= ent.position.y) {
            ent.position.y = desiredY;
          } else {
            //JAMES: Reflect velocity about slope normal.
            const normal = slopeDir.clone().setY(0).normalize().negate();
            const v = ent.movement.velocity.clone().multiplyScalar(0.2);
            const dot = v.dot(normal);
            const reflected = v
              .clone()
              .sub(normal.clone().multiplyScalar(2 * dot));
            ent.movement.velocity.copy(reflected);

            //JAMES: Nudge entity away from steps by a small amount.
            ent.position.add(normal.clone().multiplyScalar(1));

            //JAMES: Update its model and bounding box.
            ent.model.position.copy(ent.position);
            ent.updateBoundingBox();

            console.log(
              `//JAMES: Entity ${ent.id} bounced off steps; new velocity = (${ent.movement.velocity
                .toArray()
                .map((n) => n.toFixed(2))
                .join(", ")})`,
            );
          }
        } else {
          //JAMES: Entities with legs: free to ascend/descend.
          ent.position.y = desiredY;
        }
      }
    }
  }
}
