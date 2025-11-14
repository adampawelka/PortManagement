// Thumb Raiser - JPP 2021, 2022, 2023
// 3D modeling
// 3D models importing
// Perspective and orthographic projections
// Viewing
// Linear and affine transformations
// Lighting and materials
// Shadow projection
// Fog
// Texture mapping
// User interaction

import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import Orientation from "./orientation.js";
import { generalData, mazeData, playerData, lightsData, fogData, cameraData } from "./default_data.js";
import { merge } from "./merge.js";
import Maze from "./maze.js";
import Player from "./player.js";
import Lights from "./lights.js";
import Fog from "./fog.js";
import Camera from "./camera.js";
import Animations from "./animations.js";
import UserInterface from "./user_interface.js";

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
 * fogParameters = {
 *  enabled: Boolean,
 *  color: Integer,
 *  near: Float,
 *  far: Float
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
    constructor(generalParameters, mazeParameters, playerParameters, lightsParameters, fogParameters, thirdPersonViewCameraParameters) {
        this.generalParameters = merge({}, generalData, generalParameters);
        this.mazeParameters = merge({}, mazeData, mazeParameters);
        this.playerParameters = merge({}, playerData, playerParameters);
        this.lightsParameters = merge({}, lightsData, lightsParameters);
        this.fogParameters = merge({}, fogData, fogParameters);
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

        // Create the maze
        this.maze = new Maze(this.mazeParameters);

        // Create the player
        this.player = new Player(this.playerParameters);

        // Create the lights
        this.lights = new Lights(this.lightsParameters);

        // Create the fog
        this.fog = new Fog(this.fogParameters);

        // Create the cameras corresponding to the four different views:, third-person view 
        this.thirdPersonViewCamera = new Camera(this.thirdPersonViewCameraParameters, window.innerWidth, window.innerHeight);


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

        // Register the event handler to be called on mouse down
        this.renderer.domElement.addEventListener("mousedown", event => this.mouseDown(event));

        // Register the event handler to be called on mouse move
        this.renderer.domElement.addEventListener("mousemove", event => this.mouseMove(event));

        // Register the event handler to be called on mouse up
        this.renderer.domElement.addEventListener("mouseup", event => this.mouseUp(event));

        // Register the event handler to be called on mouse wheel
        this.renderer.domElement.addEventListener("wheel", event => this.mouseWheel(event));

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

        // Update player key states
        const kc = this.player.keyCodes;
        if (event.code === kc.run) this.player.keyStates.run = state;
        else if (event.code === kc.left) this.player.keyStates.left = state;
        else if (event.code === kc.right) this.player.keyStates.right = state;
        else if (event.code === kc.backward) this.player.keyStates.backward = state;
        else if (event.code === kc.forward) this.player.keyStates.forward = state;
        else if (event.code === kc.jump) this.player.keyStates.jump = state;
        else if (event.code === kc.yes) this.player.keyStates.yes = state;
        else if (event.code === kc.no) this.player.keyStates.no = state;
        else if (event.code === kc.wave) this.player.keyStates.wave = state;
        else if (event.code === kc.punch) this.player.keyStates.punch = state;
        else if (event.code === kc.thumbsUp) this.player.keyStates.thumbsUp = state;
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
        // Disable the fog
        this.fog.enabled = false;
        // Reconfigure the third-person view camera
        this.thirdPersonViewCamera.setOrientation(new Orientation(180.0, this.thirdPersonViewCamera.initialOrientation.v));
        this.thirdPersonViewCamera.setDistance(this.thirdPersonViewCamera.initialDistance);
        this.thirdPersonViewCamera.setZoom(2.0);
        // Set the final action
        this.animations.fadeToAction("Dance", 0.2);
    }

    collision(position) {
        return this.maze.distanceToWestWall(position) < this.player.radius || this.maze.distanceToEastWall(position) < this.player.radius || this.maze.distanceToNorthWall(position) < this.player.radius || this.maze.distanceToSouthWall(position) < this.player.radius;
    }

    update() {
    if (!this.gameRunning) {
        if (this.maze.loaded && this.player.loaded) {
            this.scene3D.add(this.maze.object, this.player.object, this.lights.object);
            this.clock = new THREE.Clock();
            this.animations = new Animations(this.player.object, this.player.animations);
            this.player.position.copy(this.maze.initialPosition);
            this.player.direction = this.maze.initialDirection;
            this.userInterface = new UserInterface(this.scene3D, this.renderer, this.lights, this.fog, this.player.object, this.animations);
            this.gameRunning = true;
        }
        return;
    }

    const deltaT = this.clock.getDelta();
    this.animations.update(deltaT);

    if (!this.animations.actionInProgress) {
        // Handle movement & actions
        const coveredDistance = this.player.walkingSpeed * deltaT * (this.player.keyStates.run ? this.player.runningFactor : 1);
        const directionIncrement = this.player.turningSpeed * deltaT * (this.player.keyStates.run ? this.player.runningFactor : 1);

        if (this.player.keyStates.left) this.player.direction += directionIncrement;
        if (this.player.keyStates.right) this.player.direction -= directionIncrement;

        const dirRad = THREE.MathUtils.degToRad(this.player.direction);
        let newPosition = this.player.position.clone();

        if (this.player.keyStates.forward) {
            newPosition.add(new THREE.Vector3(Math.sin(dirRad) * coveredDistance, 0, Math.cos(dirRad) * coveredDistance));
        } else if (this.player.keyStates.backward) {
            newPosition.add(new THREE.Vector3(-Math.sin(dirRad) * coveredDistance, 0, -Math.cos(dirRad) * coveredDistance));
        }

        if (this.collision(newPosition)) {
            this.animations.fadeToAction("Death", 0.2);
        } else if (this.player.keyStates.forward || this.player.keyStates.backward) {
            this.animations.fadeToAction(this.player.keyStates.run ? "Running" : "Walking", 0.2);
            this.player.position.copy(newPosition);
        } else if (this.player.keyStates.jump) this.animations.fadeToAction("Jump", 0.2);
        else if (this.player.keyStates.yes) this.animations.fadeToAction("Yes", 0.2);
        else if (this.player.keyStates.no) this.animations.fadeToAction("No", 0.2);
        else if (this.player.keyStates.wave) this.animations.fadeToAction("Wave", 0.2);
        else if (this.player.keyStates.punch) this.animations.fadeToAction("Punch", 0.2);
        else if (this.player.keyStates.thumbsUp) this.animations.fadeToAction("ThumbsUp", 0.2);
        else this.animations.fadeToAction(this.animations.activeName !== "Death" ? "Idle" : 0.6);

        this.player.object.position.copy(this.player.position);
        this.player.object.rotation.y = dirRad - this.player.initialDirection;
    }

    // Update single camera
    const target = new THREE.Vector3(this.player.position.x, this.player.position.y + this.player.eyeHeight, this.player.position.z);
    this.camera.playerDirection = this.player.direction;
    this.camera.setTarget(target);

    // Render
    this.renderer.clear();
    this.scene3D.fog = this.fog.enabled ? this.fog.object : null;
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene3D, this.camera.object);
    this.renderer.render(this.scene2D, this.camera2D);
}
}