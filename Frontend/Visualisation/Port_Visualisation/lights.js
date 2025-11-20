import * as THREE from 'three';

export class LightingManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = {};
    }

    /**
     * Setup lighting from JSON configuration
     * @param {Object} lightingConfig - Lighting configuration
     */
    setupLighting(lightingConfig) {
        // Clear any existing lights
        this.clearLights();

        if (lightingConfig.ambient) {
            const ambientLight = new THREE.AmbientLight(
                lightingConfig.ambient.color,
                lightingConfig.ambient.intensity
            );
            this.lights.ambient = ambientLight;
            this.scene.add(ambientLight);
            console.log("✓ Ambient light added");
        }

        // 2. Directional Light (US 3.3.5: "at least directional lighting")
        if (lightingConfig.directional) {
            const directionalLight = new THREE.DirectionalLight(
                lightingConfig.directional.color,
                lightingConfig.directional.intensity
            );
            
            const pos = lightingConfig.directional.position;
            directionalLight.position.set(pos.x, pos.y, pos.z);

            // Enable shadows (US 3.3.5: "Shadows or highlights must be used")
            if (lightingConfig.directional.castShadow) {
                directionalLight.castShadow = true;
                
                // Shadow camera frustum (covers port area)
                directionalLight.shadow.camera.left = -100;
                directionalLight.shadow.camera.right = 100;
                directionalLight.shadow.camera.top = 100;
                directionalLight.shadow.camera.bottom = -100;
                directionalLight.shadow.camera.near = 0.5;
                directionalLight.shadow.camera.far = 500;
                
                // Shadow quality
                const shadowMapSize = lightingConfig.directional.shadowMapSize || 2048;
                directionalLight.shadow.mapSize.width = shadowMapSize;
                directionalLight.shadow.mapSize.height = shadowMapSize;
                directionalLight.shadow.bias = -0.0001;
            }

            this.lights.directional = directionalLight;
            this.scene.add(directionalLight);
            console.log("✓ Directional light added with shadows");
        }

        // 3. Hemisphere Light (Optional - enhances realism)
        if (lightingConfig.hemisphere) {
            const hemisphereLight = new THREE.HemisphereLight(
                lightingConfig.hemisphere.skyColor,
                lightingConfig.hemisphere.groundColor,
                lightingConfig.hemisphere.intensity
            );
            this.lights.hemisphere = hemisphereLight;
            this.scene.add(hemisphereLight);
            console.log("✓ Hemisphere light added");
        }

        // Set scene background (sky color)
        if (lightingConfig.hemisphere && lightingConfig.hemisphere.skyColor) {
            this.scene.background = new THREE.Color(lightingConfig.hemisphere.skyColor);
            console.log("✓ Sky background set");
        }
    }

    /**
     * Toggle shadows on/off (US 3.3.5: performance requirement)
     * @param {boolean} enabled
     */
    toggleShadows(enabled) {
        if (this.lights.directional) {
            this.lights.directional.castShadow = enabled;
            console.log(`Shadows ${enabled ? 'enabled' : 'disabled'}`);
        }
    }

    /**
     * Adjust lighting intensity (useful for testing)
     * @param {number} factor - Multiplier (0.5 = dimmer, 2.0 = brighter)
     */
    adjustIntensity(factor) {
        if (this.lights.ambient) {
            this.lights.ambient.intensity *= factor;
        }
        if (this.lights.directional) {
            this.lights.directional.intensity *= factor;
        }
        if (this.lights.hemisphere) {
            this.lights.hemisphere.intensity *= factor;
        }
        console.log(`Lighting intensity adjusted by factor: ${factor}`);
    }

    /**
     * Clear all lights from scene
     */
    clearLights() {
        Object.values(this.lights).forEach(light => {
            this.scene.remove(light);
        });
        this.lights = {};
    }

    /**
     * Dispose of all lights
     */
    dispose() {
        this.clearLights();
    }
}