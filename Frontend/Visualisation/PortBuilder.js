import * as THREE from "three";

export class PortBuilder {
    constructor(scene) {
        this.scene = scene;
    }

    async loadPortData() {
        try {
            // 1. Brigther ligths
            this.setupLights(); 
            // ------------------------

            const response = await fetch('/port-layout.json');
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();
            
            data.facilities.forEach(facility => {
                this.buildFacility(facility);
            });

            this.buildWater();

            console.log("Escenario del puerto cargado con LUCES.");

        } catch (error) {
            console.error("Error al construir el puerto:", error);
        }
    }

    setupLights() {
        // 1. LIGTHS 
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(50, 100, 50);
        this.scene.add(sunLight);
        
        // 2. CIELO AZUL CLARO (BlUE SKY)
        // (SkyBlue)
        this.scene.background = new THREE.Color(0xa0d8ef);

        // 3. NIEBLA (FOG)
        // Parámetros: Color (igual que el cielo), Beggining (80), End (100)
        this.scene.fog = new THREE.Fog(0xa0d8ef, 80, 100);
    }
    // --------------------------------------------

    buildFacility(facility) {
        // Si es un barco, usamos la lógica avanzada
        if (facility.type === "vessel") {
            this.buildComplexVessel(facility);
            return;
        }

        // --- LÓGICA ESTÁNDAR PARA EL RESTO (Muelles, Grúas, etc.) ---
        console.log(`Building: ${facility.name} (${facility.type})`);

        const width = facility.dimensions.width;
        const height = facility.dimensions.depth;
        const length = facility.dimensions.length;
        const geometry = new THREE.BoxGeometry(width, height, length);

        let color = 0x888888;
        switch (facility.type) {
            case "dock": color = 0x555555; break;
            case "crane": color = 0xffcc00; break;
            case "container":
                const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffaa00];
                color = colors[Math.floor(Math.random() * colors.length)];
                break;
        }

        const material = new THREE.MeshPhongMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(
            facility.position.x,
            facility.position.y + (height / 2),
            facility.position.z
        );

        this.scene.add(mesh);
    }

    // --- VESSELS BUILDER ---
    buildComplexVessel(facility) {
        console.log(`Building vessel: ${facility.name}`);
        
        // We create a group to introduce all the parts of the vessel
        const vesselGroup = new THREE.Group();

        const width = facility.dimensions.width;
        const height = facility.dimensions.depth;
        const length = facility.dimensions.length;

        // 1. BASE
        let hullColor = 0x3366cc; // Blue if it has containers
        if (facility.id === "OIL_TANKER") hullColor = 0x8b0000; // Red if it has petrol

        const hullGeometry = new THREE.BoxGeometry(width, height, length);
        const hullMaterial = new THREE.MeshPhongMaterial({ color: hullColor });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);
        vesselGroup.add(hull);

        // 2. CABINE
        const bridgeHeight = height * 1.1;
        const bridgeLength = length * 0.2; // 20% of the length
        const bridgeGeometry = new THREE.BoxGeometry(width, bridgeHeight, bridgeLength);
        const bridgeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
        
        // We put in at the back part (Z positivo) and up the BASE
        bridge.position.set(0, height, (length / 2) - (bridgeLength / 2));
        vesselGroup.add(bridge);

        // 3. CARGA O DETALLES (Diferenciación)
        if (facility.id === "OIL_TANKER") {
            // --> IF IT HAS PETROIL: We put a Cylinder 
            const pipeGeometry = new THREE.CylinderGeometry(width/4, width/4, length * 0.2);
            const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
            const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
            pipe.rotation.x = Math.PI / 2; // Rotate the cilinder till it's resting
            pipe.position.set(0, height/2 + 1, -bridgeLength/2);
            vesselGroup.add(pipe);

        } else {
            // --> If it has containers
            this.addContainersToShip(vesselGroup, width, height, length, bridgeLength);
        }

        // 4. Put vessels on the water
        // And we put them a little bit behind the sea level (-1)
        vesselGroup.position.set(
            facility.position.x,
            facility.position.y + (height / 2) - 1, 
            facility.position.z
        );

        this.scene.add(vesselGroup);
    }

    // Auxiliar Function to put containers on the vessel
    addContainersToShip(group, shipWidth, shipHeight, shipLength, bridgeLength) {
        const containerSize = 2;
        const startZ = -(shipLength / 2) + 1; // Start by the bow (proa)
        const endZ = (shipLength / 2) - bridgeLength - 1; // Stop before the CABINE

        // Rows and columns of containers
        for (let z = startZ; z < endZ; z += containerSize + 0.5) {
            for (let x = -shipWidth/2 + 1; x < shipWidth/2 - 1; x += containerSize + 0.5) {
                // Random heigth (Between 1 or 2)
                const stackHeight = Math.random() > 0.5 ? 1 : 2;
                
                for (let y = 0; y < stackHeight; y++) {
                    const geometry = new THREE.BoxGeometry(containerSize, containerSize, containerSize);
                    const colors = [0xff0000, 0x00ff00, 0xffff00, 0x00ffff];
                    const material = new THREE.MeshPhongMaterial({ 
                        color: colors[Math.floor(Math.random() * colors.length)] 
                    });
                    const container = new THREE.Mesh(geometry, material);
                    
                    // Put them relative to the center of the vessel
                    container.position.set(
                        x + containerSize/2, 
                        (shipHeight / 2) + (y * containerSize) + (containerSize/2), 
                        z + containerSize/2
                    );
                    
                    group.add(container);
                }
            }
        }
    }

    buildWater() {
        // We build a big sea 
        const geometry = new THREE.PlaneGeometry(1000, 1000); 
        
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x0099ff, 
            shininess: 80,
            side: THREE.DoubleSide 
        });
        const water = new THREE.Mesh(geometry, material);
        
        water.rotation.x = -Math.PI / 2; 
        water.position.y = -0.5; 
        
        this.scene.add(water);
    }
}