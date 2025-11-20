import * as THREE from 'three';

export class MaterialManager {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
    }

    /**
     * Create material with textures for procedural objects (docks, water)
     * @param {Object} materialConfig - Material configuration
     * @returns {THREE.Material}
     */
    createMaterial(materialConfig) {
        const materialParams = {
            roughness: materialConfig.roughness !== undefined ? materialConfig.roughness : 0.5,
            metalness: materialConfig.metalness !== undefined ? materialConfig.metalness : 0.0,
        };

        // Add base color if provided
        if (materialConfig.color) {
            materialParams.color = new THREE.Color(materialConfig.color);
        }
        
        if (materialConfig.colorMap) {
            try {
                materialParams.map = this.textureLoader.load(materialConfig.colorMap);
                materialParams.map.wrapS = THREE.RepeatWrapping;
                materialParams.map.wrapT = THREE.RepeatWrapping;
                materialParams.map.repeat.set(100, 100);
                console.log(`Loaded color map: ${materialConfig.colorMap}`);
            } catch (error) {
                console.warn(`Failed to load color map: ${materialConfig.colorMap}`, error);
            }
        }

        // Load normal map
        if (materialConfig.normalMap) {
            try {
                materialParams.normalMap = this.textureLoader.load(materialConfig.normalMap);
                materialParams.normalMap.wrapS = THREE.RepeatWrapping;
                materialParams.normalMap.wrapT = THREE.RepeatWrapping;
                materialParams.normalMap.repeat.set(5, 5);
                console.log(`Loaded normal map: ${materialConfig.normalMap}`);
            } catch (error) {
                console.warn(`Failed to load normal map: ${materialConfig.normalMap}`, error);
            }
        }

        return new THREE.MeshStandardMaterial(materialParams);
    }
}