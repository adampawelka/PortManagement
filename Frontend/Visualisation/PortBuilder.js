import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MaterialManager } from "./Port_Visualisation/materials.js";

export class PortBuilder {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader(); // To initialize models motor
    this.materialManager = new MaterialManager();
    this.data = null;
    this.lights = {};
    this.dynamicObjects = {
      vessels: [],
      resources: [],
    };
  }

  async loadPortData() {
    try {
      const response = await fetch("/port-layout.json");
      this.data = await response.json();

      this.setupLights();

      this.data.facilities.forEach((facility) => {
        this.buildFacility(facility);
      });

      this.buildWater();
      console.log("Puerto realista cargado.");
    } catch (error) {
      console.error("Error cargando port-layout.json:", error);
    }
  }

  // ==========================
  //  NUEVO: datos dinámicos
  // ==========================

  /**
   * dynamicData = {
   *   vesselVisitNotifications: [...],
   *   resources: [...],
   *   docks: [...]
   * }
   */
  applyDynamicData(dynamicData) {
    const { vesselVisitNotifications, resources, docks } = dynamicData || {};

    if (!vesselVisitNotifications || !resources) {
      console.warn("applyDynamicData: faltan datos de VVN o Resources");
      return;
    }

    // --- 1) Construir un mapa dockId -> posición aproximada en el puerto ---
    const dockPositionMap = this.buildDockPositionMap(docks);

    // --- 2) Barcos de visitas aprobadas con muelle asignado ---
    const approvedVisits = vesselVisitNotifications.filter((v) => {
      // ⚠️ AJUSTA ESTAS PROPIEDADES A TU DTO REAL:
      // status: string, por ejemplo "Approved"
      // assignedDockId: Guid del muelle asignado
      return (
        v.status === "Approved" && // TODO: cambia si tu estado se llama distinto
        v.assignedDockId &&        // TODO: ajusta al nombre real de la propiedad
        dockPositionMap[v.assignedDockId]
      );
    });

    approvedVisits.forEach((visit, index) => {
      const dockPos = dockPositionMap[visit.assignedDockId];
      this.addVesselFromBackend(visit, dockPos, index);
    });

    // --- 3) Recursos con área asignada ---
    const resourcesWithArea = resources.filter((r) => {
      // ⚠️ AJUSTA ESTAS PROPIEDADES A TU DTO REAL:
      // assignedAreaCode / assignedAreaName / assignedAreaId...
      return r.assignedAreaCode || r.assignedAreaName || r.assignedAreaId;
    });

    resourcesWithArea.forEach((resource, index) => {
      const areaPos = this.getDefaultAreaPosition(index);
      this.addResourceFromBackend(resource, areaPos);
    });
  }

  // Mapea cada dockId a una posición base en el puerto.
  buildDockPositionMap(docks) {
    const map = {};

    if (!docks || docks.length === 0) {
      return map;
    }

    // Posiciones base que puedes ajustar para que coincidan con tus docks reales
    const basePositions = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(160, 0, 0),
      new THREE.Vector3(-160, 0, 0),
    ];

    docks.forEach((dock, index) => {
      // ⚠️ AJUSTA ESTE NOMBRE A TU DTO: asumo dock.id
      const id = dock.id || dock.Id;
      if (!id) return;

      const base = basePositions[index % basePositions.length];
      // Una pequeña variación en Z para varios barcos por dock
      map[id] = new THREE.Vector3(base.x, base.y, base.z + index * 10);
    });

    return map;
  }

  getDefaultAreaPosition(index) {
    // Posiciones donde colocar grúas / recursos; ajusta según tu escenario
    const x = -80 + (index % 4) * 40;
    const z = -40 - Math.floor(index / 4) * 40;
    return new THREE.Vector3(x, 0, z);
  }

  addVesselFromBackend(visit, position, index) {
    if (!position) return;

    // Puedes elegir el modelo según el tipo de buque si tu DTO lo tiene
    // Por defecto, usamos un container ship
    const modelPath = "/models/container_ship.glb";

    this.loader.load(
      modelPath,
      (gltf) => {
        const ship = gltf.scene;

        const scale = 40.0;
        ship.scale.set(scale, scale, scale);
        ship.position.copy(position);
        ship.rotation.y = Math.PI; // que mire hacia el muelle

        ship.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        this.scene.add(ship);
        this.dynamicObjects.vessels.push(ship);
        console.log("Barco añadido para visita:", visit.id || visit.Id);
      },
      undefined,
      (error) => {
        console.warn("No se pudo cargar container_ship.glb, usando cubo de fallback", error);

        const geometry = new THREE.BoxGeometry(30, 10, 80);
        const material = new THREE.MeshStandardMaterial({ color: 0xff6600 });
        const cubeShip = new THREE.Mesh(geometry, material);

        cubeShip.position.copy(position);
        cubeShip.castShadow = true;
        cubeShip.receiveShadow = true;

        this.scene.add(cubeShip);
        this.dynamicObjects.vessels.push(cubeShip);
      }
    );
  }

  addResourceFromBackend(resource, position) {
    if (!position) return;

    // ⚠️ Ajusta el tipo según tu DTO: type, resourceType, etc.
    const type = (resource.type || resource.resourceType || "").toLowerCase();

    let modelPath = "";
    if (type.includes("crane")) {
      modelPath = "/models/crane.glb";
    } else if (type.includes("truck")) {
      modelPath = "/models/truck.glb";
    }

    if (modelPath) {
      this.loader.load(
        modelPath,
        (gltf) => {
          const obj = gltf.scene;
          const scale = type.includes("crane") ? 1.2 : 2.5;

          obj.scale.set(scale, scale, scale);
          obj.position.copy(position);

          obj.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });

          this.scene.add(obj);
          this.dynamicObjects.resources.push(obj);
          console.log("Recurso añadido:", resource.code || resource.id);
        },
        undefined,
        (error) => {
          console.warn("No se pudo cargar modelo para recurso, usando cubo de fallback", error);
          this.addResourceFallbackCube(resource, position);
        }
      );
    } else {
      // Si no hay modelo específico, cubo genérico
      this.addResourceFallbackCube(resource, position);
    }
  }

  addResourceFallbackCube(resource, position) {
    const geometry = new THREE.BoxGeometry(10, 20, 10);
    const material = new THREE.MeshStandardMaterial({ color: 0x00aaee });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.copy(position);
    cube.castShadow = true;
    cube.receiveShadow = true;

    this.scene.add(cube);
    this.dynamicObjects.resources.push(cube);
  }

  // ==========================
  //  Código original
  // ==========================

  //Brigther ligths
  setupLights() {
    const config = this.data.lighting;

    const ambientLight = new THREE.AmbientLight(config.ambient.color, config.ambient.intensity);
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

    this.scene.fog = new THREE.Fog(0xa0d8ef, 40, 135);
    console.log("Lighting setup complete (Ambient + Directional + Hemisphere + Sky)");
  }

  buildFacility(facility) {
    // 1. If it is an imported model
    if (
      facility.type === "vessel" ||
      facility.type === "container_stack" ||
      facility.type === "crane"
    ) {
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
    } else if (facility.id === "SMALL_BOAT") {
      modelPath = "/models/fishing_boat.glb";
      scale = 4.0;
      rotationY = -Math.PI / 2; // Rotate 90 degrees
      yOffset = 3.0;
    } else if (facility.type === "container_stack") {
      modelPath = "/models/container_stack.glb";
      scale = 2.5;
      yOffset = 2.15;
    } else if (facility.type === "crane") {
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
      facility.position.y + height / 2,
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
      console.log(`Shadows ${enabled ? "ON" : "OFF"}`);
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
    Object.values(this.lights).forEach((light) => this.scene.remove(light));
    this.lights = {};
  }
}
