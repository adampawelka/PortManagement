import * as THREE from "three";

export default class CameraController {
    constructor(camera, renderer, floorY = 0) {
        this.camera = camera;
        this.renderer = renderer;

        // State
        this.mousePosition = new THREE.Vector2();
        this.isRotating = false;
        //this.isZooming = false;

        this.target = new THREE.Vector3(0, 0, 0);
        this.floorY = floorY; // floor level

        // Distance limits
        this.minDistance = 5;
        this.maxDistance = 80;

        // Vertical rotation limits
        this.minPolarAngle = 0.1;           
        this.maxPolarAngle = Math.PI - 0.1;   

        // Bound event handlers
        this.boundMouseDown = e => this.mouseDown(e);
        this.boundMouseMove = e => this.mouseMove(e);
        this.boundMouseUp = e => this.mouseUp(e);
        this.boundWheel = e => this.mouseWheel(e);

        // Add listeners
        this.renderer.domElement.addEventListener("mousedown", this.boundMouseDown);
        this.renderer.domElement.addEventListener("mousemove", this.boundMouseMove);
        this.renderer.domElement.addEventListener("mouseup", this.boundMouseUp);
        this.renderer.domElement.addEventListener("wheel", this.boundWheel);

        // Initial spherical
        this.updateSpherical();
    }

    updateSpherical() {
        const offset = this.camera.position.clone().sub(this.target);
        this.spherical = new THREE.Spherical().setFromVector3(offset);
    }

    mouseDown(event) {
        //if (event.buttons === 1) this.isZooming = true;      // left button drag = zoom
        if (event.buttons === 2) this.isRotating = true;     // right button drag = rotate
        this.mousePosition.set(event.clientX, event.clientY);
    }

    mouseMove(event) {
        if (!this.camera) return;
        const newMouse = new THREE.Vector2(event.clientX, event.clientY);
        const delta = newMouse.clone().sub(this.mousePosition);
        this.mousePosition.copy(newMouse);

        this.updateSpherical();

        if (this.isRotating) {
            const rotationSpeed = 0.005;
            this.spherical.theta -= delta.x * rotationSpeed;  // horizontal rotation
            this.spherical.phi -= delta.y * rotationSpeed;    // vertical rotation

            // Clamp vertical rotation
            this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
        }

        // if (this.isZooming) {
        //     const zoomSpeed = 0.05;
        //     let newRadius = this.spherical.radius + delta.y * zoomSpeed;
        //     newRadius = Math.max(this.minDistance, Math.min(this.maxDistance, newRadius));
        //     this.spherical.radius = newRadius;
        // }

        // Convert spherical to Cartesian
        const offset = new THREE.Vector3().setFromSpherical(this.spherical);
        const proposedPos = this.target.clone().add(offset);

        // Enforce floor boundary
        if (proposedPos.y < this.floorY + 0.1) {
            proposedPos.y = this.floorY + 0.1;  
            offset.y = proposedPos.y - this.target.y;
            this.spherical.setFromVector3(offset);
        }

        this.camera.position.copy(proposedPos);
        this.camera.up.set(0, 1, 0);  // Keep camera upright
        this.camera.lookAt(this.target);
    }

    mouseUp() {
        this.isRotating = false;
        //this.isZooming = false;
    }

    mouseWheel(event) {
        if (!this.camera) return;
        event.preventDefault();

        this.updateSpherical();
        const zoomFactor = 1 - event.deltaY * 0.001;
        let newRadius = this.spherical.radius * zoomFactor;
        newRadius = Math.max(this.minDistance, Math.min(this.maxDistance, newRadius));
        this.spherical.radius = newRadius;

        const offset = new THREE.Vector3().setFromSpherical(this.spherical);
        const proposedPos = this.target.clone().add(offset);

        // Floor boundary
        if (proposedPos.y < this.floorY + 0.1) proposedPos.y = this.floorY + 0.1;

        this.camera.position.copy(proposedPos);
        this.camera.lookAt(this.target);
    }

    dispose() {
        const dom = this.renderer.domElement;
        dom.removeEventListener("mousedown", this.boundMouseDown);
        dom.removeEventListener("mousemove", this.boundMouseMove);
        dom.removeEventListener("mouseup", this.boundMouseUp);
        dom.removeEventListener("wheel", this.boundWheel);
    }
}
