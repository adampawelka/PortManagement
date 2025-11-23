import * as THREE from "three";
import Stats from "../three.js-master/examples/jsm/libs/stats.module.js";
import Orientation from "./orientation.js";
import { generalData, cameraData } from "./default_data.js";
import { merge } from "./merge.js";
// import Lights from "./lights_template.js";
import Camera from "./camera.js";
import CameraController from "./mouse.js";


export default class Port {
    constructor(generalParameters, thirdPersonViewCameraParameters) {
        this.generalParameters = merge({}, generalData, generalParameters);
        // this.lightsParameters = merge({}, lightsData, lightsParameters);
        this.thirdPersonViewCameraParameters = merge({}, cameraData, thirdPersonViewCameraParameters);

        // Create a 2D scene (the viewports frames)
        this.scene2D = new THREE.Scene();

        // Create a square
        let points = [new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0), new THREE.Vector3(1.0, 1.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0)];
        let squareGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const squareMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        this.square = new THREE.LineLoop(squareGeometry, squareMaterial);
        this.scene2D.add(this.square);

        // Create the camera corresponding to the 2D scene
        this.camera2D = new THREE.OrthographicCamera(0.0, 1.0, 1.0, 0.0, 0.0, 1.0);

        // Create a 3D scene (the visualisation itself)
        this.scene3D = new THREE.Scene();
        
        // Add a simple test cube to verify rendering
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 0, 0); 
        this.scene3D.add(cube);

        this.thirdPersonViewCamera = new Camera(this.thirdPersonViewCameraParameters, window.innerWidth, window.innerHeight);

    // Create the statistics and make its node invisible
    this.statistics = new Stats();
    this.statistics.dom.style.visibility = "hidden";
    // Prefer mounting UI elements inside the #parent container when available
    const container = document.getElementById('parent') || document.body;
    container.appendChild(this.statistics.dom);

        // Create a renderer and turn on shadows in the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
        if (this.generalParameters.setDevicePixelRatio) {
            this.renderer.setPixelRatio(window.devicePixelRatio);
        }
        this.renderer.autoClear = false;
    
    // Size renderer to fit parent container or fallback to a reasonable default
    const width = container.clientWidth || 800;
    const height = Math.min(container.clientHeight || 600, window.innerHeight - 200);
    this.renderer.setSize(width, height);
    
    // Make sure the canvas is positioned within the parent container
    this.renderer.domElement.style.position = 'relative';
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.margin = '0 auto';
    this.renderer.domElement.style.zIndex = '0';
    
    // Set a default clear color so the canvas isn't transparent against the page background
    this.renderer.setClearColor(0x0a0a0a);
    container.appendChild(this.renderer.domElement);

        // Create a single camera controller and keep a reference so we can reuse it
        // when switching the active view camera. The controller attaches listeners
        // to the renderer DOM element and operates on the `camera` property.
        this.cameraController = new CameraController(this.thirdPersonViewCamera.object, this.renderer);

        // Set the mouse move action (none)
        //this.dragMiniMap = false;
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;

        // Set the visualisation state
        this.visualisationRunning = false;

        // Get and configure the panel's <div> elements
        this.viewsPanel = document.getElementById("views-panel");
        this.view = document.getElementById("view");
        this.projection = document.getElementById("projection");
        this.horizontal = document.getElementById("horizontal");
        this.horizontal.step = 1;
        this.vertical = document.getElementById("vertical");
        this.vertical.step = 1;
        this.distance = document.getElementById("distance");
        this.distance.step = 0.1;
        this.zoom = document.getElementById("zoom");
        this.zoom.step = 0.1;

        // Build the help panel
        // this.buildHelpPanel();

        // Set the active view camera (fixed view)
        this.setActiveViewCamera(this.thirdPersonViewCamera);

        // Single view mode only - no multiple views
        if (this.activeViewCamera) {
            this.activeViewCamera.setViewport(false);  // false = single view
        }

        // Register the event handler to be called on window resize
        window.addEventListener("resize", event => this.windowResize(event));

        // Register the event handler to be called on key down
        // document.addEventListener("keydown", event => this.keyChange(event, true));

        // Register the event handler to be called on key release
        // document.addEventListener("keyup", event => this.keyChange(event, false));

        // Register the event handler to be called on context menu
        this.renderer.domElement.addEventListener("contextmenu", event => this.contextMenu(event))

        // Register the event handler to be called on select, input number, or input checkbox change
        // this.view.addEventListener("change", event => this.elementChange(event));
        // this.projection.addEventListener("change", event => this.elementChange(event));
        // this.horizontal.addEventListener("change", event => this.elementChange(event));
        // this.vertical.addEventListener("change", event => this.elementChange(event));
        // this.distance.addEventListener("change", event => this.elementChange(event));
        // this.zoom.addEventListener("change", event => this.elementChange(event));
        // this.userInterfaceCheckBox.addEventListener("change", event => this.elementChange(event));
        // this.helpCheckBox.addEventListener("change", event => this.elementChange(event));
        // this.statisticsCheckBox.addEventListener("change", event => this.elementChange(event));

        this.reset = document.getElementById("reset");
        this.resetAll = document.getElementById("reset-all");
        this.userInterfaceCheckBox = document.getElementById("user-interface");
        this.helpCheckBox = document.getElementById("help");
        this.statisticsCheckBox = document.getElementById("statistics");
        
        // Also ensure panel references are retrieved for setVisibility/etc.
        //this.subwindowsPanel = document.getElementById("subwindows-panel"); 
        //this.helpPanel = document.getElementById("help-panel");

        // Register the event handler to be called on input button click
        this.reset.addEventListener("click", event => this.buttonClick(event));
        this.resetAll.addEventListener("click", event => this.buttonClick(event));

        this.activeElement = document.activeElement;
    }

    // buildHelpPanel() {
    //     const table = document.getElementById("help-table");
    // }

    // displayPanel() {
    //     this.view.options.selectedIndex = ["third-person"].indexOf(this.activeViewCamera.view);
    //     this.projection.options.selectedIndex = ["perspective", "orthographic"].indexOf(this.activeViewCamera.projection);
    //     this.horizontal.value = this.activeViewCamera.orientation.h.toFixed(0);
    //     this.vertical.value = this.activeViewCamera.orientation.v.toFixed(0);
    //     this.distance.value = this.activeViewCamera.distance.toFixed(1);
    //     this.zoom.value = this.activeViewCamera.zoom.toFixed(1);
    // }

    // Set active view camera
    setActiveViewCamera(camera) {
        this.activeViewCamera = camera;
        // Keep the controller in sync with the currently active camera
        if (this.cameraController) this.cameraController.camera = this.activeViewCamera.object;
        this.horizontal.min = this.activeViewCamera.orientationMin.h.toFixed(0);
        this.horizontal.max = this.activeViewCamera.orientationMax.h.toFixed(0);
        this.vertical.min = this.activeViewCamera.orientationMin.v.toFixed(0);
        this.vertical.max = this.activeViewCamera.orientationMax.v.toFixed(0);
        this.distance.min = this.activeViewCamera.distanceMin.toFixed(1);
        this.distance.max = this.activeViewCamera.distanceMax.toFixed(1);
        this.zoom.min = this.activeViewCamera.zoomMin.toFixed(1);
        this.zoom.max = this.activeViewCamera.zoomMax.toFixed(1);
        this.displayPanel();
    }

    pointerIsOverViewport(pointer, viewport) {
        return (
            pointer.x >= viewport.x &&
            pointer.x < viewport.x + viewport.width &&
            pointer.y >= viewport.y &&
            pointer.y < viewport.y + viewport.height);
    }

    getPointedViewport(pointer) {
        // Simplified: this build only uses a single/main view (third-person by default).
        // Return active view if the pointer is inside its viewport, otherwise "none".
        const viewport = this.activeViewCamera.getViewport();
        if (this.pointerIsOverViewport(pointer, viewport)) {
            return this.activeViewCamera.view;
        }
        return "none";
    }

    setUserInterfaceVisibility(visible) {
        this.userInterfaceCheckBox.checked = visible;
        this.viewsPanel.style.visibility = visible ? "visible" : "hidden";
        this.subwindowsPanel.style.visibility = visible ? "visible" : "hidden";
        this.userInterface.setVisibility(visible);
    }

    setHelpVisibility(visible) { // Hidden: false; visible: true
        this.helpCheckBox.checked = visible;
        this.helpPanel.style.visibility = visible ? "visible" : "hidden";
    }

    setStatisticsVisibility(visible) { // Hidden: false; visible: true
        this.statisticsCheckBox.checked = visible;
        this.statistics.dom.style.visibility = visible ? "visible" : "hidden";
    }

    windowResize() {
        this.thirdPersonViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    contextMenu(event) {
        // Prevent the context menu from appearing when the secondary mouse button is clicked
        event.preventDefault();
    }

    elementChange(event) {
        switch (event.target.id) {
            case "view":
                this.setActiveViewCamera([this.thirdPersonViewCamera][this.view.options.selectedIndex]);
                break;
            case "projection":
                this.activeViewCamera.setActiveProjection(["perspective", "orthographic"][this.projection.options.selectedIndex]);
                this.displayPanel();
                break;
            case "horizontal":
            case "vertical":
            case "distance":
            case "zoom":
                if (event.target.checkValidity()) {
                    switch (event.target.id) {
                        case "horizontal":
                        case "vertical":
                            this.activeViewCamera.setOrientation(new Orientation(this.horizontal.value, this.vertical.value));
                            break;
                        case "distance":
                            this.activeViewCamera.setDistance(this.distance.value);
                            break;
                        case "zoom":
                            this.activeViewCamera.setZoom(this.zoom.value);
                            break;
                    }
                }
                break;
            // Multiple views removed - using single view only
            case "user-interface":
                this.setUserInterfaceVisibility(event.target.checked);
                break;
            case "help":
                this.setHelpVisibility(event.target.checked);
                break;
            case "statistics":
                this.setStatisticsVisibility(event.target.checked);
                break;
        }
    }

    buttonClick(event) {
        switch (event.target.id) {
            case "reset":
                this.activeViewCamera.initialize();
                break;
            case "reset-all":
                this.thirdPersonViewCamera.initialize();
                break;
        }
        this.displayPanel();
    }

    finalSequence() {
        this.thirdPersonViewCamera.setOrientation(new Orientation(180.0, this.thirdPersonViewCamera.initialOrientation.v));
        this.thirdPersonViewCamera.setDistance(this.thirdPersonViewCamera.initialDistance);
        this.thirdPersonViewCamera.setZoom(2.0);
        // Set it as the active view camera
        this.setActiveViewCamera(this.thirdPersonViewCamera);
        // Set single-view mode
        this.setViewMode(false);
    }
    update() {
        // Update statistics if enabled
        if (this.statistics) {
            this.statistics.update();
        }

        // Clear and prepare for rendering
        this.renderer.clear();

        // Get viewport for our single camera view
        const viewport = this.activeViewCamera.getViewport();

        // Set the viewport and render both 3D and 2D scenes
        this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
        this.renderer.render(this.scene3D, this.activeViewCamera.object);
        this.renderer.render(this.scene2D, this.camera2D);
        this.renderer.clearDepth();
    }

}
