import * as THREE from 'three';

class LightingManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = {};
    }

    setupLighting(lightingConfig) {
        if (lightingConfig.ambient) {
            const ambientLight = new THREE.AmbientLight(
                lightingConfig.ambient.color,
                lightingConfig.ambient.intensity
            );
            this.lights.ambient = ambientLight;
            this.scene.add(ambientLight);
        }

        if (lightingConfig.directional) {
            const directionalLight = new THREE.DirectionalLight(
                lightingConfig.directional.color,
                lightingConfig.directional.intensity
            );
            
            const pos = lightingConfig.directional.position;
            directionalLight.position.set(pos.x, pos.y, pos.z);

            if (lightingConfig.directional.castShadow) {
                directionalLight.castShadow = true;

                directionalLight.shadow.camera.left = -100;
                directionalLight.shadow.camera.right = 100;
                directionalLight.shadow.camera.top = 100;
                directionalLight.shadow.camera.bottom = -100;
                directionalLight.shadow.camera.near = 0.5;
                directionalLight.shadow.camera.far = 500;

                const shadowMapSize = lightingConfig.directional.shadowMapSize || 2048;
                directionalLight.shadow.mapSize.width = shadowMapSize;
                directionalLight.shadow.mapSize.height = shadowMapSize;

                directionalLight.shadow.radius = 2;
                directionalLight.shadow.bias = -0.0001;
            }

            this.lights.directional = directionalLight;
            this.scene.add(directionalLight);
        }

        if (lightingConfig.hemisphere) {
            const hemisphereLight = new THREE.HemisphereLight(
                lightingConfig.hemisphere.skyColor,
                lightingConfig.hemisphere.groundColor,
                lightingConfig.hemisphere.intensity
            );
            this.lights.hemisphere = hemisphereLight;
            this.scene.add(hemisphereLight);
        }
    }

    updateLighting(camera) {
        if (this.lights.directional) {
            const offset = new THREE.Vector3(50, 100, 50);
            this.lights.directional.target.position.copy(camera.position);
            this.lights.directional.target.updateMatrixWorld();
        }
    }

    toggleShadows(enabled) {
        if (this.lights.directional) {
            this.lights.directional.castShadow = enabled;
        }
        
        if (this.lights.pointLights) {
            this.lights.pointLights.forEach(light => {
                light.castShadow = enabled;
            });
        }
    }

    setTimeOfDay(timeOfDay) {
        const presets = {
            morning: {
                ambient: 0.3,
                directional: 0.6,
                directionalColor: '#FFE5B4'
            },
            noon: {
                ambient: 0.5,
                directional: 1.0,
                directionalColor: '#FFFFFF'
            },
            evening: {
                ambient: 0.2,
                directional: 0.4,
                directionalColor: '#FF7F50'
            },
            night: {
                ambient: 0.1,
                directional: 0.2,
                directionalColor: '#4169E1'
            }
        };

        const preset = presets[timeOfDay] || presets.noon;
        
        if (this.lights.ambient) {
            this.lights.ambient.intensity = preset.ambient;
        }
        
        if (this.lights.directional) {
            this.lights.directional.intensity = preset.directional;
            this.lights.directional.color.set(preset.directionalColor);
        }
    }

    dispose() {
        Object.values(this.lights).forEach(light => {
            if (Array.isArray(light)) {
                light.forEach(l => this.scene.remove(l));
            } else {
                this.scene.remove(light);
            }
        });
        this.lights = {};
    }
}

export default LightingManager;