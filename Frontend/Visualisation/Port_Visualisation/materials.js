import * as THREE from 'three';

class MaterialManager {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.materialCache = new Map();
    }

    createMaterial(materialConfig) {
        // Check cache first
        const cacheKey = JSON.stringify(materialConfig);
        if (this.materialCache.has(cacheKey)) {
            return this.materialCache.get(cacheKey).clone();
        }

        const materialParams = {
            color: new THREE.Color(materialConfig.color || '#ffffff'),
            roughness: materialConfig.roughness !== undefined ? materialConfig.roughness : 0.5,
            metalness: materialConfig.metalness !== undefined ? materialConfig.metalness : 0.0,
        };

        // Load color/diffuse map
        if (materialConfig.colorMap) {
            materialParams.map = this.textureLoader.load(materialConfig.colorMap);
            materialParams.map.wrapS = THREE.RepeatWrapping;
            materialParams.map.wrapT = THREE.RepeatWrapping;
        }

        // Load normal map (for surface detail)
        if (materialConfig.normalMap) {
            materialParams.normalMap = this.textureLoader.load(materialConfig.normalMap);
            materialParams.normalMap.wrapS = THREE.RepeatWrapping;
            materialParams.normalMap.wrapT = THREE.RepeatWrapping;
        }

        // Load roughness map (for surface variation)
        if (materialConfig.roughnessMap) {
            materialParams.roughnessMap = this.textureLoader.load(materialConfig.roughnessMap);
            materialParams.roughnessMap.wrapS = THREE.RepeatWrapping;
            materialParams.roughnessMap.wrapT = THREE.RepeatWrapping;
        }

        // Load bump map (alternative to normal map)
        if (materialConfig.bumpMap) {
            materialParams.bumpMap = this.textureLoader.load(materialConfig.bumpMap);
            materialParams.bumpScale = materialConfig.bumpScale || 0.05;
        }

        const material = new THREE.MeshStandardMaterial(materialParams);
        this.materialCache.set(cacheKey, material);
        
        return material.clone();
    }

    applyMaterialToModel(model, material) {
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = material;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }

    createOptimizedMaterial(category, config) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            return new THREE.MeshLambertMaterial({
                color: new THREE.Color(config.color || '#ffffff'),
                map: config.colorMap ? this.textureLoader.load(config.colorMap) : null
            });
        }
        
        return this.createMaterial(config);
    }

    dispose() {
        this.materialCache.forEach(material => {
            if (material.map) material.map.dispose();
            if (material.normalMap) material.normalMap.dispose();
            if (material.roughnessMap) material.roughnessMap.dispose();
            if (material.bumpMap) material.bumpMap.dispose();
            material.dispose();
        });
        this.materialCache.clear();
    }
}

export default MaterialManager;