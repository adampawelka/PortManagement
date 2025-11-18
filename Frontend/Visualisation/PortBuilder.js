import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class PortBuilder {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader(); // Inicializamos cargador
    }

    async loadPortData() {
        try {
            this.setupLights();

            const response = await fetch('/port-layout.json');
            const data = await response.json();
            
            data.facilities.forEach(facility => {
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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = true;
        this.scene.add(sunLight);

        // (BlUE SKY)
        this.scene.background = new THREE.Color(0xa0d8ef);
        // (FOG)
        this.scene.fog = new THREE.Fog(0xa0d8ef, 20, 135);
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
        const material = new THREE.MeshPhongMaterial({ color: 0x555555 });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(
            facility.position.x,
            facility.position.y + (height / 2), 
            facility.position.z
        );
        
        mesh.receiveShadow = true;
        this.scene.add(mesh);
    }

    // Make de sea
    buildWater() {
        const geometry = new THREE.PlaneGeometry(10000, 10000);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x0099ff, 
            shininess: 100,
            side: THREE.DoubleSide 
        });
        const water = new THREE.Mesh(geometry, material);
        water.rotation.x = -Math.PI / 2; 
        water.position.y = -0.2; 
        water.receiveShadow = true;
        this.scene.add(water);
    }
}