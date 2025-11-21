import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MaterialManager } from './Port_Visualisation/materials.js';

export class PortBuilder {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader(); // To initialize models motor
        this.materialManager = new MaterialManager();
        this.data = null;
        this.lights = {};
    }

    async loadPortData() {
        try {

            const response = await fetch('/port-layout.json');
            this.data = await response.json();
            
            this.setupLights();

            this.data.facilities.forEach(facility => {
                this.buildFacility(facility);
            });

            this.buildWater();
            console.log("Puerto realista cargado.");

        } catch (error) {
            console.error("Error:", error);
        }
    }

    //Brigther ligths
        setupLights() {
        const config = this.data.lighting;

        const ambientLight = new THREE.AmbientLight(
            config.ambient.color, 
            config.ambient.intensity
        );
        this.lights.ambient = ambientLight;
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(
            config.directional.color, 
            config.directional.intensity
        );
        sunLight.position.set(
            config.directional.position.x,
            config.directional.position.y,
            config.directional.position.z
        );
        
        // Enable shadows
        sunLight.castShadow = true;
        sunLight.shadow.camera.left = -100;
        sunLight.shadow.camera.right = 100;
        sunLight.shadow.camera.top = 100;
        sunLight.shadow.camera.bottom = -100;
        sunLight.shadow.mapSize.width = config.directional.shadowMapSize;
        sunLight.shadow.mapSize.height = config.directional.shadowMapSize;
        
        this.lights.directional = sunLight;
        this.scene.add(sunLight);
        const hemisphereLight = new THREE.HemisphereLight(
            config.hemisphere.skyColor,
            config.hemisphere.groundColor,
            config.hemisphere.intensity
        );
        this.lights.hemisphere = hemisphereLight;
        this.scene.add(hemisphereLight);

        // 4. Sky Background
        this.scene.background = new THREE.Color(config.hemisphere.skyColor);

        console.log("Lighting setup complete (Ambient + Directional + Hemisphere + Sky)");
    
    }
    buildFacility(facility) {
        // 1. If it is an imported model
        if (facility.type === "vessel" || facility.type === "container_stack" || facility.type === "crane") {
            this.loadModelForFacility(facility);
            return;
        }

        // 2. If it's a simple object
        this.buildProceduralBlock(facility);
    }

    // For imported models
    loadModelForFacility(facility) {
        // Some variables of each model
        let modelPath = "";
        let scale = 1;
        let rotationY = 0;
        let yOffset = 0;

        // Models
        if (facility.id === "BIG_CARGO") {
            modelPath = "/models/container_ship.glb";
            scale = 40.0;
            rotationY = Math.PI; // To look to opposite 
            yOffset = 6.0;
        } 
        else if (facility.id === "SMALL_BOAT") {
            modelPath = "/models/fishing_boat.glb";
            scale = 4.0; 
            rotationY = -Math.PI / 2; // Rotate 90 degrees
            yOffset = 3.0;
        }
        else if (facility.type === "container_stack") {
            modelPath = "/models/container_stack.glb";
            scale = 2.5; 
            yOffset = 2.15;
        }
        else if (facility.type === "crane") {
            modelPath = "/models/crane.glb";
            scale = 1.2;
            yOffset = 0.0;
            rotationY = Math.PI / 2; // Rotate it to look to the ship
        }

        // If it isn't an imported model get out
        if (!modelPath) return;

        // LOAD
        this.loader.load(modelPath, (gltf) => {
            const model = gltf.scene;
            
            // We apply the Offset logic
            model.position.set(
                facility.position.x, 
                facility.position.y + yOffset, // Sumamos la altura extra
                facility.position.z
            );
            
            model.scale.set(scale, scale, scale);
            model.rotation.y = rotationY;
            

            // Shadows
            model.traverse((node) => {
                if (node.isMesh) { 
                    node.castShadow = true; 
                    node.receiveShadow = true; 
                }
            });

            this.scene.add(model);
            console.log(`Cargado: ${facility.name}`);
        });
    }

    // Simple objects (Dock)
    buildProceduralBlock(facility) {
        const width = facility.dimensions.width;
        const height = facility.dimensions.depth;
        const length = facility.dimensions.length;
        
        const geometry = new THREE.BoxGeometry(width, height, length);

        const repeatU = width / 2; 
        const repeatV = length / 2;
        const materialConfig = this.data.materials.dock;
        const material = this.materialManager.createMaterial(materialConfig, repeatU, repeatV);
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(
            facility.position.x,
            facility.position.y + (height / 2),
            facility.position.z
        );
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.scene.add(mesh);
    }

    // Make de sea
    buildWater() {
        const geometry = new THREE.PlaneGeometry(10000, 10000);
        
        const repeatU = 100; // Tile 100 times horizontally
        const repeatV = 100; // Tile 100 times vertically

        const materialConfig = this.data.materials.water;
        const material = this.materialManager.createMaterial(materialConfig, repeatU, repeatV);
        
        const water = new THREE.Mesh(geometry, material);
        water.rotation.x = -Math.PI / 2;
        water.position.y = -0.2; 
        water.receiveShadow = true;
        
        this.scene.add(water);
    }
    toggleShadows(enabled) {
        if (this.lights.directional) {
            this.lights.directional.castShadow = enabled;
            console.log(`Shadows ${enabled ? 'ON' : 'OFF'}`);
        }
    }

    adjustBrightness(factor) {
        if (this.lights.ambient) this.lights.ambient.intensity *= factor;
        if (this.lights.directional) this.lights.directional.intensity *= factor;
        if (this.lights.hemisphere) this.lights.hemisphere.intensity *= factor;
        console.log(`Brightness adjusted by ${factor}x`);
    }

    dispose() {
        // Remove lights
        Object.values(this.lights).forEach(light => this.scene.remove(light));
        this.lights = {};
    }
}