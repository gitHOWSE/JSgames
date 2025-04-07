// DebugTools.js
//JAMES: This module provides debugging helpers for the Three.js scene.
//JAMES: Use the enableDebugging() function to add AxesHelper, GridHelper,
//JAMES: BoxHelper for a given entity (like vacuum), ArrowHelper for its forward direction,
//JAMES: a CameraHelper for directional light shadow frustum, and Stats.js for performance monitoring.

import * as THREE from "three";
import Stats from "stats.js";

export function enableDebugging({
  scene,
  camera,
  renderer,
  vacuum = null,
  directionalLight = null,
}) {
  //JAMES: Object to store references to debugging helpers.
  const debugHelpers = {};

  //JAMES: Add AxesHelper to visualize world axes (red: X, green: Y, blue: Z).
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  debugHelpers.axesHelper = axesHelper;

  //JAMES: Add GridHelper to visualize the ground plane.
  const gridHelper = new THREE.GridHelper(50, 50);
  scene.add(gridHelper);
  debugHelpers.gridHelper = gridHelper;

  //JAMES: If a vacuum object is provided, add a BoxHelper for its mesh.
  if (vacuum && vacuum.mesh) {
    const boxHelper = new THREE.BoxHelper(vacuum.mesh, 0xffff00);
    scene.add(boxHelper);
    debugHelpers.boxHelper = boxHelper;
  }

  //JAMES: If a directional light is provided and it casts shadows, add a CameraHelper
  //JAMES: to visualize the shadow camera's frustum.
  if (
    directionalLight &&
    directionalLight.shadow &&
    directionalLight.shadow.camera
  ) {
    const shadowCameraHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera,
    );
    scene.add(shadowCameraHelper);
    debugHelpers.shadowCameraHelper = shadowCameraHelper;
  }

  //JAMES: If a vacuum object is provided, add an ArrowHelper to show its forward direction.
  if (vacuum && vacuum.mesh) {
    //JAMES: Initial forward vector along negative Z-axis.
    const direction = new THREE.Vector3(0, 0, -1).normalize();
    //JAMES: Create the ArrowHelper at the vacuum's position.
    const arrowHelper = new THREE.ArrowHelper(
      direction,
      vacuum.mesh.position.clone(),
      2,
      0x00ff00,
    );
    scene.add(arrowHelper);
    debugHelpers.arrowHelper = arrowHelper;
  }

  //JAMES: Initialize Stats.js for performance monitoring.
  const stats = new Stats();
  stats.showPanel(0); //JAMES: 0: fps panel.
  document.body.appendChild(stats.dom);
  debugHelpers.stats = stats;

  //JAMES: Return the debugHelpers object so they can be updated later if needed.
  return debugHelpers;
}
