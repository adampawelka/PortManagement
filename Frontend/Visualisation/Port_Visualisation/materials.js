import * as THREE from 'three';

export class MaterialManager {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
    }

    /**
     * Create material with proper texture tiling and roughness emphasis
     * @param {Object} materialConfig - Material configuration
     * @param {number} repeatU - Horizontal texture repeat (default: 10)
     * @param {number} repeatV - Vertical texture repeat (default: 10)
     * @returns {THREE.Material}
     */
    createMaterial(materialConfig, repeatU = 10, repeatV = 10) {
        const materialParams = {
            roughness: materialConfig.roughness !== undefined ? materialConfig.roughness : 0.5,
            metalness: materialConfig.metalness !== undefined ? materialConfig.metalness : 0.0,
        };

        // Add base color (subtle, so texture is more visible)
        if (materialConfig.color) {
            materialParams.color = new THREE.Color(materialConfig.color);
        }

        // Load color map with tiling
        if (materialConfig.colorMap) {
            try {
                const colorMap = this.textureLoader.load(materialConfig.colorMap);
                colorMap.wrapS = THREE.RepeatWrapping;
                colorMap.wrapT = THREE.RepeatWrapping;
                colorMap.repeat.set(repeatU, repeatV); // TILE THE TEXTURE
                materialParams.map = colorMap;
                console.log(`✓ Color map loaded and tiled (${repeatU}x${repeatV}): ${materialConfig.colorMap}`);
            } catch (error) {
                console.warn(`Failed to load color map: ${materialConfig.colorMap}`, error);
            }
        }

        if (materialConfig.normalMap) {
            try {
                const normalMap = this.textureLoader.load(materialConfig.normalMap);
                normalMap.wrapS = THREE.RepeatWrapping;
                normalMap.wrapT = THREE.RepeatWrapping;
                normalMap.repeat.set(repeatU, repeatV);
                materialParams.normalMap = normalMap;
                materialParams.normalScale = new THREE.Vector2(5.0, 5.0);
                console.log(`Normal map loaded and tiled (${repeatU}x${repeatV}): ${materialConfig.normalMap}`);
            } catch (error) {
                console.warn(`Failed to load normal map: ${materialConfig.normalMap}`, error);
            }
        }

        if (materialConfig.roughnessMap) {
            try {
                const roughnessMap = this.textureLoader.load(materialConfig.roughnessMap);
                roughnessMap.wrapS = THREE.RepeatWrapping;
                roughnessMap.wrapT = THREE.RepeatWrapping;
                roughnessMap.repeat.set(repeatU, repeatV);
                materialParams.roughnessMap = roughnessMap;
                console.log(`Roughness map loaded and tiled: ${materialConfig.roughnessMap}`);
            } catch (error) {
                console.warn(`Failed to load roughness map: ${materialConfig.roughnessMap}`, error);
            }
        }

        return new THREE.MeshStandardMaterial(materialParams);
    }
}