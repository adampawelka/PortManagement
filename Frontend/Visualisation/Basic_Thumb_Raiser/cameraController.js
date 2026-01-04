import * as THREE from "three";

export default class CameraController {
    constructor(camera, renderer, onObjectSelected = null, floorY = 0) {
        this.camera = camera;
        this.renderer = renderer;
        this.onObjectSelected = onObjectSelected;

        this.raycaster = new THREE.Raycaster();
        this.pickables = [];        // objects that can be selected
        this.selectedObject = null; // last selected

        // State
        this.mousePosition = new THREE.Vector2();
        this.isRotating = false;

        this.isTransitioning = false;
        this.transitionStart = null;
        this.transitionDuration = 0.8; // seconds
        this.startPosition = new THREE.Vector3();
        this.startTarget = new THREE.Vector3();
        this.endPosition = new THREE.Vector3();
        this.endTarget = new THREE.Vector3();

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
        this.boundKeyDown = this.onKeyDown.bind(this);

        // Add listeners
        this.renderer.domElement.addEventListener("mousedown", this.boundMouseDown);
        this.renderer.domElement.addEventListener("mousemove", this.boundMouseMove);
        this.renderer.domElement.addEventListener("mouseup", this.boundMouseUp);
        this.renderer.domElement.addEventListener("wheel", this.boundWheel);
        window.addEventListener("keydown", this.boundKeyDown);

        // Initial spherical
        this.updateSpherical();
    }

    setInitialView() {
        this.initialPosition = this.camera.position.clone();
        this.initialTarget = this.target.clone();
    }

    updateSpherical() {
        const offset = this.camera.position.clone().sub(this.target);
        this.spherical = new THREE.Spherical().setFromVector3(offset);
    }

    mouseDown(event) {
        if (event.buttons === 1) this.isPicking = true;
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

    mouseUp(event) {
        if (this.isRotating) {
            this.isRotating = false;
        }
        if (this.isPicking) {
            const picked = this.pickObject(event);
            if (!picked) {
                this.clearHighlight();
            }
        }

        this.isPicking = false;
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

    onKeyDown(event) {
        // Np. klawisz 'R' do resetu kamery
        if (event.key === "r" || event.key === "R") {
            this.resetCamera();
        }
    }

    pickObject(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        this.raycaster.setFromCamera(mouse, this.camera);
        const intersections = this.raycaster.intersectObjects(this.pickables, true);
        if (!intersections.length) return;

        let object = intersections[0].object;

        // Walk up until the top-level object that is in pickables
        while (object.parent && !this.pickables.includes(object)) {
            object = object.parent;
        }

        this.highlight(object);
        this.focusOnObject(object);

        return true;
    }

    highlight(object) {
        // Remove previous highlight
        if (this.selectedObject) {
            this.selectedObject.traverse((node) => {
                if (node.isMesh && node.material && node.material.emissive) {
                    node.material.emissive.set(0x000000);
                }
            });
        }

        // Apply highlight to all meshes in the new object
        if (object) {
            object.traverse((node) => {
                if (node.isMesh && node.material && node.material.emissive) {
                    node.material.emissive.set(0x4444ff);
                }
            });

            this.selectedObject = object;
            // LOG DE DEPURACIÓN
            console.log("1. Highlight ejecutado. Objeto:", object);
            console.log("2. Callback onObjectSelected es:", this.onObjectSelected);
            console.log("3. UserData del objeto:", object.userData);

            if (this.onObjectSelected && object.userData) {
                // Enviamos los datos (id, name, type) a React
                this.onObjectSelected(object.userData);
            }
        }
    }

    clearHighlight() {
        if (!this.selectedObject) return;

        this.selectedObject.traverse(node => {
            if (node.isMesh && node.material?.emissive) {
                node.material.emissive.set(0x000000);
            }
        });

        this.selectedObject = null;

        if (this.onObjectSelected) {
            this.onObjectSelected(null); // Enviamos null para limpiar la UI
        }
    }


    focusOnObject(object) {
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);

        // Bazowy distanceFactor
        let distanceFactor = 1.5;

        // Jeśli to containers, zwiększamy odległość
        if (object.userData.type === "container_stack") {
            distanceFactor = 2.5; // dalsze odsunięcie
        }

        let offsetDistance = maxDim * distanceFactor;

        // Ograniczamy minimalną i maksymalną odległość
        offsetDistance = Math.max(offsetDistance, 10); // min
        offsetDistance = Math.min(offsetDistance, 50); // max

        const direction = new THREE.Vector3().subVectors(this.camera.position, this.target).normalize();
        const newCameraPos = center.clone().add(direction.multiplyScalar(offsetDistance));

        this.startPosition.copy(this.camera.position);
        this.startTarget.copy(this.target);
        this.endPosition.copy(newCameraPos);
        this.endTarget.copy(center);

        this.transitionStart = performance.now() / 1000;
        this.isTransitioning = true;
    }

    update(deltaTime) {
        if (this.isTransitioning) {
            const t = (performance.now() / 1000 - this.transitionStart) / this.transitionDuration;
            const easedT = t < 1 ? t * t * (3 - 2 * t) : 1; // smoothstep easing

            this.camera.position.lerpVectors(this.startPosition, this.endPosition, easedT);
            this.target.lerpVectors(this.startTarget, this.endTarget, easedT);
            this.camera.lookAt(this.target);

            if (t >= 1) {
                this.isTransitioning = false;
            }
        }
    }

    resetCamera() {
        this.clearHighlight(); // removes current highlight
        this.startPosition.copy(this.camera.position);
        this.startTarget.copy(this.target);
        this.endPosition.copy(this.initialPosition);
        this.endTarget.copy(this.initialTarget);

        this.transitionStart = performance.now() / 1000;
        this.isTransitioning = true;
    }

    dispose() {
        const dom = this.renderer.domElement;
        dom.removeEventListener("mousedown", this.boundMouseDown);
        dom.removeEventListener("mousemove", this.boundMouseMove);
        dom.removeEventListener("mouseup", this.boundMouseUp);
        dom.removeEventListener("wheel", this.boundWheel);
    }
}
