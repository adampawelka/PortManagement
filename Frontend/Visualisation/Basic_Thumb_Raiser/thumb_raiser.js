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
import { generalData, mazeData, lightsData, cameraData } from "./default_data.js";
import { merge } from "./merge.js";
import Maze from "./maze.js";
import Lights from "./lights.js";
import Camera from "./camera.js";
import { PortBuilder } from "../PortBuilder.js";
import CameraController from "./mouse.js";

/*
 * generalParameters = {
 *  setDevicePixelRatio: Boolean
 * }
 *
 * mazeParameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 *
 * playerParameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3,
 *  walkingSpeed: Float,
 *  initialDirection: Float,
 *  turningSpeed: Float,
 *  runningFactor: Float,
 *  keyCodes: { thirdPersonView: String, run: String, left: String, right: String, backward: String, forward: String, jump: String, yes: String, no: String, wave: String, punch: String, thumbsUp: String }
 * }
 *
 * lightsParameters = {
 *  ambientLight: { color: Integer, intensity: Float },
 *  pointLight1: { color: Integer, intensity: Float, range: Float, position: Vector3 },
 *  pointLight2: { color: Integer, intensity: Float, range: Float, position: Vector3 },
 *  spotLight: { color: Integer, intensity: Float, range: Float, angle: Float, penumbra: Float, position: Vector3, direction: Float }
 * }
 *


 *

 *
 * thirdPersonViewCameraParameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  target: Vector3,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 *

 */

export default class ThumbRaiser {
    constructor(generalParameters, mazeParameters, lightsParameters, thirdPersonViewCameraParameters) {
        this.generalParameters = merge({}, generalData, generalParameters);
        this.mazeParameters = merge({}, mazeData, mazeParameters);
        this.lightsParameters = merge({}, lightsData, lightsParameters);
        this.thirdPersonViewCameraParameters = merge({}, cameraData, thirdPersonViewCameraParameters);

        // Create a 2D scene (the viewports frames)
        this.scene2D = new THREE.Scene();

        // Create a square
        let points = [new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0), new THREE.Vector3(1.0, 1.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0)];
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        this.square = new THREE.LineLoop(geometry, material);
        this.scene2D.add(this.square);

        // Create the camera corresponding to the 2D scene
        this.camera2D = new THREE.OrthographicCamera(0.0, 1.0, 1.0, 0.0, 0.0, 1.0);

        // Create a 3D scene (the game itself)
        this.scene3D = new THREE.Scene();

        // Create the port
        const portBuilder = new PortBuilder(this.scene3D);
        portBuilder.loadPortData();

        // Create the maze
        this.maze = new Maze(this.mazeParameters);


        // Create the lights
        this.lights = new Lights(this.lightsParameters);

        // Create the cameras corresponding to the four different views:, third-person view 
        this.thirdPersonViewCamera = new Camera(this.thirdPersonViewCameraParameters, window.innerWidth, window.innerHeight);
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
        //document.body.appendChild(this.renderer.domElement);

        this.cameraController = new CameraController(this.camera.object, this.renderer);

        // Set the mouse move action (none)
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;

        // Set the game state
        this.gameRunning = false;

       

        // Arrange viewports by view mode

        // Register the event handler to be called on window resize
        window.addEventListener("resize", event => this.windowResize(event));

        // Register the event handler to be called on key down
        document.addEventListener("keydown", event => this.keyChange(event, true));

        // Register the event handler to be called on key release
        document.addEventListener("keyup", event => this.keyChange(event, false));

        // Register the event handler to be called on context menu
        this.renderer.domElement.addEventListener("contextmenu", event => this.contextMenu(event));


        this.activeElement = document.activeElement;
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

mouseDown(event) {
    if (event.buttons === 1 || event.buttons === 2) {
        // Store mouse position (origin top-left to bottom-left)
        this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
    }
}

mouseMove(event) {
    // Optional: keep only if you want mouse-based camera interaction
}

mouseUp(event) {
    // Reset any mouse-based actions
    this.changeCameraDistance = false;
    this.changeCameraOrientation = false;
}

mouseWheel(event) {
    // Prevent page scrolling
    event.preventDefault();
    // Store mouse position (if needed for zoom logic)
    this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
}

contextMenu(event) {
    event.preventDefault(); // Disable right-click menu
}


    finalSequence() {
        // Reconfigure the third-person view camera
        this.thirdPersonViewCamera.setOrientation(new Orientation(180.0, this.thirdPersonViewCamera.initialOrientation.v));
        this.thirdPersonViewCamera.setDistance(this.thirdPersonViewCamera.initialDistance);
        this.thirdPersonViewCamera.setZoom(2.0);
    }

    update() {
    

    if (!this.gameRunning) {
        if (this.maze.loaded) {
            this.scene3D.add(this.maze.object, this.lights.object);
            this.maze.object.visible = false; // Hide the maze to show the Port
            this.thirdPersonViewCamera.object.position.set(0, 30, 54); // X = 60, Y = 15, Z = 0 if we want to see the side face
            this.thirdPersonViewCamera.object.lookAt(0, 0, 0);
            this.clock = new THREE.Clock();
            this.gameRunning = true;
        }
        return;
    }


    // Render
    this.renderer.clear();
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene3D, this.camera.object);
    this.renderer.render(this.scene2D, this.camera2D);
}
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
import { generalData, mazeData, lightsData, cameraData } from "./default_data.js";
import { merge } from "./merge.js";
import Maze from "./maze.js";
import Lights from "./lights.js";
import Camera from "./camera.js";
import { PortBuilder } from "../PortBuilder.js";
import CameraController from "./mouse.js";

/*
 * generalParameters = {
 *  setDevicePixelRatio: Boolean
 * }
 *
 * mazeParameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 *
 * playerParameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3,
 *  walkingSpeed: Float,
 *  initialDirection: Float,
 *  turningSpeed: Float,
 *  runningFactor: Float,
 *  keyCodes: { thirdPersonView: String, run: String, left: String, right: String, backward: String, forward: String, jump: String, yes: String, no: String, wave: String, punch: String, thumbsUp: String }
 * }
 *
 * lightsParameters = {
 *  ambientLight: { color: Integer, intensity: Float },
 *  pointLight1: { color: Integer, intensity: Float, range: Float, position: Vector3 },
 *  pointLight2: { color: Integer, intensity: Float, range: Float, position: Vector3 },
 *  spotLight: { color: Integer, intensity: Float, range: Float, angle: Float, penumbra: Float, position: Vector3, direction: Float }
 * }
 *


 *

 *
 * thirdPersonViewCameraParameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  target: Vector3,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 *

 */

export default class ThumbRaiser {
    constructor(generalParameters, mazeParameters, lightsParameters, thirdPersonViewCameraParameters) {
        this.generalParameters = merge({}, generalData, generalParameters);
        this.mazeParameters = merge({}, mazeData, mazeParameters);
        this.lightsParameters = merge({}, lightsData, lightsParameters);
        this.thirdPersonViewCameraParameters = merge({}, cameraData, thirdPersonViewCameraParameters);

        // Create a 2D scene (the viewports frames)
        this.scene2D = new THREE.Scene();

        // Create a square
        let points = [new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0), new THREE.Vector3(1.0, 1.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0)];
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        this.square = new THREE.LineLoop(geometry, material);
        this.scene2D.add(this.square);

        // Create the camera corresponding to the 2D scene
        this.camera2D = new THREE.OrthographicCamera(0.0, 1.0, 1.0, 0.0, 0.0, 1.0);

        // Create a 3D scene (the game itself)
        this.scene3D = new THREE.Scene();

        // Create the port
        const portBuilder = new PortBuilder(this.scene3D);
        portBuilder.loadPortData();

        // Create the maze
        this.maze = new Maze(this.mazeParameters);


        // Create the lights
        this.lights = new Lights(this.lightsParameters);

        // Create the cameras corresponding to the four different views:, third-person view 
        this.thirdPersonViewCamera = new Camera(this.thirdPersonViewCameraParameters, window.innerWidth, window.innerHeight);
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
        //document.body.appendChild(this.renderer.domElement);

        this.cameraController = new CameraController(this.camera.object, this.renderer);

        // Set the mouse move action (none)
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;

        // Set the game state
        this.gameRunning = false;

       

        // Arrange viewports by view mode

        // Register the event handler to be called on window resize
        window.addEventListener("resize", event => this.windowResize(event));

        // Register the event handler to be called on key down
        document.addEventListener("keydown", event => this.keyChange(event, true));

        // Register the event handler to be called on key release
        document.addEventListener("keyup", event => this.keyChange(event, false));

        // Register the event handler to be called on context menu
        this.renderer.domElement.addEventListener("contextmenu", event => this.contextMenu(event));


        this.activeElement = document.activeElement;
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

mouseDown(event) {
    if (event.buttons === 1 || event.buttons === 2) {
        // Store mouse position (origin top-left to bottom-left)
        this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
    }
}

mouseMove(event) {
    // Optional: keep only if you want mouse-based camera interaction
}

mouseUp(event) {
    // Reset any mouse-based actions
    this.changeCameraDistance = false;
    this.changeCameraOrientation = false;
}

mouseWheel(event) {
    // Prevent page scrolling
    event.preventDefault();
    // Store mouse position (if needed for zoom logic)
    this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
}

contextMenu(event) {
    event.preventDefault(); // Disable right-click menu
}


    finalSequence() {
        // Reconfigure the third-person view camera
        this.thirdPersonViewCamera.setOrientation(new Orientation(180.0, this.thirdPersonViewCamera.initialOrientation.v));
        this.thirdPersonViewCamera.setDistance(this.thirdPersonViewCamera.initialDistance);
        this.thirdPersonViewCamera.setZoom(2.0);
    }

    update() {
    

    if (!this.gameRunning) {
        if (this.maze.loaded) {
            this.scene3D.add(this.maze.object, this.lights.object);
            this.maze.object.visible = false; // Hide the maze to show the Port
            this.thirdPersonViewCamera.object.position.set(0, 30, 54); // X = 60, Y = 15, Z = 0 if we want to see the side face
            this.thirdPersonViewCamera.object.lookAt(0, 0, 0);
            this.clock = new THREE.Clock();
            this.gameRunning = true;
        }
        return;
    }


    // Render
    this.renderer.clear();
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene3D, this.camera.object);
    this.renderer.render(this.scene2D, this.camera2D);
}
}