// Util/LoadingScreen.js
"use strict";

import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";

export class LoadingScreen {
  constructor(camera) {
    const distance = 2;
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const height = 2 * Math.tan(fov / 2) * distance;
    const width = height * camera.aspect;

    this.container = new ThreeMeshUI.Block({
      width: width,
      height: height,
      padding: 0.02,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: new THREE.Color(0x8b0000),
      backgroundOpacity: 1.0,
    });

    this.container.position.set(0, 0, -distance);
    camera.add(this.container);

    this.text = new ThreeMeshUI.Text({
      content: "Loading Models Please Wait",
      fontFamily: "./fonts/VT323-Regular.json",
      fontTexture: "./fonts/VT323.png",
      fontSize: 1,
      textColor: new THREE.Color(0x90ee90),
    });

    this.container.add(this.text);
    this.hide();
  }

  show() {
    this.container.visible = true;
  }

  hide() {
    this.container.visible = false;
  }
}
