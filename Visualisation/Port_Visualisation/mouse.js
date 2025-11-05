// CameraController.js
import * as THREE from "three"
;

export default class CameraController {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;
        
        // State variables
        this.mousePosition = new THREE.Vector2();
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;
        
        // Target point to orbit around
        this.target = new THREE.Vector3(0, 0, 0);

        // Bound event handlers (keep references for removal)
        this.boundMouseDown = event => this.mouseDown(event);
        this.boundMouseMove = event => this.mouseMove(event);
        this.boundMouseUp = event => this.mouseUp(event);
        this.boundMouseWheel = event => this.mouseWheel(event);

        // Attach event handlers
        this.renderer.domElement.addEventListener("mousedown", this.boundMouseDown);
        this.renderer.domElement.addEventListener("mousemove", this.boundMouseMove);
        this.renderer.domElement.addEventListener("mouseup", this.boundMouseUp);
        this.renderer.domElement.addEventListener("wheel", this.boundMouseWheel);
    }

    mouseDown(event) {
        if (event.buttons === 1 || event.buttons === 2) {
            this.mousePosition.set(event.clientX, window.innerHeight - event.clientY - 1);
            if (event.buttons === 1) this.changeCameraDistance = true;
            if (event.buttons === 2) this.changeCameraOrientation = true;
        }
    }

    mouseMove(event) {
        if (!this.camera) return;  // Guard against null camera
        
        if (this.changeCameraDistance || this.changeCameraOrientation) {
            const newMousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
            const delta = newMousePosition.clone().sub(this.mousePosition);
            this.mousePosition.copy(newMousePosition);

            if (this.changeCameraDistance) {
                // Move camera along view direction, with bounds
                const moveSpeed = 0.05;
                const direction = this.camera.getWorldDirection(new THREE.Vector3());
                const newPos = this.camera.position.clone().addScaledVector(direction, delta.y * moveSpeed);
                // Optional: Add min/max distance checks here if needed
                this.camera.position.copy(newPos);
            } 
            if (this.changeCameraOrientation) {
                const rotationSpeed = 0.005;
                
                // Calculate the camera's position relative to target
                const offset = this.camera.position.clone().sub(this.target);
                
                // Create rotation matrices for vertical and horizontal rotations
                const rotateY = new THREE.Matrix4().makeRotationY(-delta.x * rotationSpeed);
                
                // Apply horizontal rotation to the offset
                offset.applyMatrix4(rotateY);
                
                // Create a right vector for vertical rotation
                const right = new THREE.Vector3().crossVectors(offset, new THREE.Vector3(0, 1, 0)).normalize();
                const rotateX = new THREE.Matrix4().makeRotationAxis(right, -delta.y * rotationSpeed);
                
                // Apply vertical rotation to the offset
                offset.applyMatrix4(rotateX);
                
                // Update camera position
                this.camera.position.copy(this.target).add(offset);
                
                // Make camera look at target
                this.camera.lookAt(this.target);
                this.camera.updateMatrix();
            }
        }
    }

    mouseUp(event) {
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;
    }

    mouseWheel(event) {
        if (!this.camera) return;  // Guard against null camera
        
        event.preventDefault();
        // Smoother zoom with bounds checking
        const zoomSpeed = 0.001;
        const minDistance = 0.1;
        const maxDistance = 10;
        
        // Get current distance from target
        const offset = this.camera.position.clone().sub(this.target);
        const currentDistance = offset.length();
        
        // Calculate new distance
        const zoomFactor = 1 - event.deltaY * zoomSpeed;
        const newDistance = currentDistance * zoomFactor;
        
        // Check if new distance would be within bounds
        if (newDistance >= minDistance && newDistance <= maxDistance) {
            // Scale the offset to maintain direction but change distance
            offset.multiplyScalar(zoomFactor);
            this.camera.position.copy(this.target).add(offset);
        }
    }

    // Clean up event listeners
    dispose() {
        if (this.renderer && this.renderer.domElement) {
            const dom = this.renderer.domElement;
            dom.removeEventListener("mousedown", this.boundMouseDown);
            dom.removeEventListener("mousemove", this.boundMouseMove);
            dom.removeEventListener("mouseup", this.boundMouseUp);
            dom.removeEventListener("wheel", this.boundMouseWheel);
        }
    }
}
