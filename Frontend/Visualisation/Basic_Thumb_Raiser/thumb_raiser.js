// Thumb Raiser - JPP 2021, 2022, 2023
// 3D modeling
// 3D models importing
// Perspective and orthographic projections
// Viewing
// Linear and affine transformations
// Lighting and materials
// Shadow projection
// Texture mapping
// User interaction

import * as THREE from "three";
import Orientation from "./orientation.js";
import { generalData, lightsData, cameraData } from "./default_data.js";
import { merge } from "./merge.js";
import Lights from "./lights.js";
import Camera from "./camera.js";
import { PortBuilder } from "../PortBuilder.js";
import CameraController from "./cameraController.js";

export default class ThumbRaiser {
  constructor(generalParameters, lightsParameters, thirdPersonViewCameraParameters) {
    this.generalParameters = merge({}, generalData, generalParameters);
    this.lightsParameters = merge({}, lightsData, lightsParameters);
    this.thirdPersonViewCameraParameters = merge({}, cameraData, thirdPersonViewCameraParameters);

    // Create a 2D scene (the viewports frames)
    this.scene2D = new THREE.Scene();

    // Create a square
    let points = [
      new THREE.Vector3(0.0, 0.0, 0.0),
      new THREE.Vector3(1.0, 0.0, 0.0),
      new THREE.Vector3(1.0, 1.0, 0.0),
      new THREE.Vector3(0.0, 1.0, 0.0),
    ];
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    this.square = new THREE.LineLoop(geometry, material);
    this.scene2D.add(this.square);

    // Create the camera corresponding to the 2D scene
    this.camera2D = new THREE.OrthographicCamera(0.0, 1.0, 1.0, 0.0, 0.0, 1.0);

    // Create a 3D scene (the game itself)
    this.scene3D = new THREE.Scene();


    // Create the lights
    this.lights = new Lights(this.lightsParameters);

    // Create the cameras corresponding to the four different views:, third-person view
    this.thirdPersonViewCamera = new Camera(
      this.thirdPersonViewCameraParameters,
      window.innerWidth,
      window.innerHeight
    );
    this.camera = this.thirdPersonViewCamera;

    this.theCanvas = document.getElementById("myCanvas");

    // Create a renderer and turn on shadows in the renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.theCanvas, antialias: true });
    if (this.generalParameters.setDevicePixelRatio) {
      this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.cameraController = new CameraController(this.camera.object, this.renderer);


    // *** Crear el puerto (PortBuilder) y guardarlo en this para usarlo después
    this.portBuilder = new PortBuilder(this.scene3D);
    this.portBuilder.cameraController = this.cameraController;
    this.portBuilder.loadPortData().then(() => {
      const pickables = [];
      this.portBuilder.scene.traverse(obj => {
        if (obj.userData?.pickable) pickables.push(obj);
      });

      this.cameraController.pickables = pickables;
    });

    // Set the mouse move action (none)
    this.changeCameraDistance = false;
    this.changeCameraOrientation = false;

    // Set the game state
    this.gameRunning = false;

    // Register the event handler to be called on window resize
    window.addEventListener("resize", (event) => this.windowResize(event));

    // Register the event handler to be called on key down
    document.addEventListener("keydown", (event) => this.keyChange(event, true));

    // Register the event handler to be called on key release
    document.addEventListener("keyup", (event) => this.keyChange(event, false));

    // Register the event handler to be called on context menu
    this.renderer.domElement.addEventListener("contextmenu", (event) => this.contextMenu(event));

    this.activeElement = document.activeElement;

    this.clock = new THREE.Clock();

  }

  loadDynamicObjects(dynamicData) {
    if (!this.portBuilder || !dynamicData) return;

    this.portBuilder.applyDynamicData(dynamicData);
  }

  windowResize() {
    this.camera.updateWindowSize(window.innerWidth, window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  keyChange(event, state) {
    // Only process input if focus is on the body
    if (document.activeElement === document.body) {
      // Prevent scrolling with Space or Arrow keys
      const keysToPrevent = ["Space", "ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"];
      if (keysToPrevent.includes(event.code)) event.preventDefault();
    }
  }


  contextMenu(event) {
    event.preventDefault(); // Disable right-click menu
  }

  finalSequence() {
    // Reconfigure the third-person view camera
    this.thirdPersonViewCamera.setOrientation(
      new Orientation(180.0, this.thirdPersonViewCamera.initialOrientation.v)
    );
    this.thirdPersonViewCamera.setDistance(this.thirdPersonViewCamera.initialDistance);
    this.thirdPersonViewCamera.setZoom(2.0);
  }

  update() {
    if (!this.gameRunning) {

      this.scene3D.add(this.lights.object);
      this.thirdPersonViewCamera.object.position.set(0, 30, 54);
      this.thirdPersonViewCamera.object.lookAt(0, 0, 0);
      this.cameraController.setInitialView();
      this.clock = new THREE.Clock();
      this.gameRunning = true;
      return;
    }

    // Render
    this.renderer.clear();
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene3D, this.camera.object);
    this.renderer.render(this.scene2D, this.camera2D);
    const deltaTime = this.clock.getDelta(); // seconds since last call
    this.cameraController.update(deltaTime);
  }
}
