import * as THREE from "three";

export class PortBuilder {
    constructor(scene) {
        this.scene = scene;
    }

    async loadPortData() {
        try {
            const response = await fetch('/port-layout.json');
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();
            
            // 1. Dibujar objetos del JSON
            data.facilities.forEach(facility => {
                this.buildFacility(facility);
            });

            // 2. Crear el AGUA (Canal)
            this.buildWater();

            console.log("Escenario del puerto cargado.");

        } catch (error) {
            console.error("Error al construir el puerto:", error);
        }
    }

    buildFacility(facility) {
        const width = facility.dimensions.width;   // X
        const height = facility.dimensions.depth;  // Y (Altura)
        const length = facility.dimensions.length; // Z

        const geometry = new THREE.BoxGeometry(width, height, length);

        let color = 0x888888; 

        // Asignamos colores según el tipo
        switch (facility.type) {
            case "dock":
                color = 0x555555; // Gris cemento
                break;
            case "vessel":
                color = 0x3366cc; // Azul oscuro (casco del barco)
                break;
            case "crane":
                color = 0xffcc00; // Amarillo industrial
                break;
            case "container":
                // Truco: Colores aleatorios para contenedores
                const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffaa00];
                color = colors[Math.floor(Math.random() * colors.length)];
                break;
        }

        const material = new THREE.MeshPhongMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);

        // Ajuste de altura:
        // Si es un barco, lo hundimos un poquito (-0.5) para que parezca que flota.
        // Si es tierra, lo ponemos sobre el nivel 0.
        let yOffset = height / 2;
        if (facility.type === "vessel") yOffset = (height / 2) - 1; 

        mesh.position.set(
            facility.position.x,
            facility.position.y + yOffset,
            facility.position.z
        );

        this.scene.add(mesh);
    }

    buildWater() {
        // Un plano gigante azul para el agua
        const geometry = new THREE.PlaneGeometry(400, 400); // <--- CAMBIA ESTO
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x0099ff, 
            shininess: 80,
            side: THREE.DoubleSide 
        });
        const water = new THREE.Mesh(geometry, material);
        
        water.rotation.x = -Math.PI / 2; // Tumbarlo horizontal
        water.position.y = -0.5; // Un poco abajo para no chocar con los muelles
        
        this.scene.add(water);
    }
}