import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MaterialManager } from "./Basic_Thumb_Raiser/materials.js";

export class PortBuilder {
  constructor(scene, cameraController) {
    this.scene = scene;
    this.cameraController = cameraController; // <--- Guardamos la referencia
    this.loader = new GLTFLoader(); // Model loader
    this.materialManager = new MaterialManager();
    this.data = null;
    this.lights = {};
    this.dynamicObjects = {
      vessels: [],
      resources: [],
      buildings: [],
    };
  }

  buildMainPlatform() {
      // Dimensiones de la explanada del puerto (Suelo)
      const width = 800;  // Muy ancho para que quepan recursos a la derecha
      const depth = 400;  // Profundo para almacenes atrás
      const height = 2;   // Grosor del hormigón

      const geometry = new THREE.BoxGeometry(width, height, depth);
      
      // Configuración del material (usando tus texturas si existen, o gris por defecto)
      const materialConfig = this.data.materials?.dock || { color: 0x555555 };
      const material = this.materialManager.createMaterial(materialConfig, width/10, depth/10);

      const ground = new THREE.Mesh(geometry, material);
      
      // POSICIÓN: 
      // Y = 0 (o -1 para que el agua tape la base)
      // Z = -200 (Para que el borde del muelle esté en Z=0 y el resto hacia atrás)
      ground.position.set(100, 1, -200); 
      
      ground.receiveShadow = true;
      this.scene.add(ground);
  }

  // 2. Llama a este método dentro de loadPortData()
  async loadPortData() {
      try {
        const response = await fetch("/port-layout.json");
        this.data = await response.json();
        this.setupLights();
        
        // --- CAMBIO: CONSTRUIR LA PLATAFORMA GIGANTE ---
        this.buildMainPlatform(); 
        // -----------------------------------------------

        this.buildWater();
      } catch (error) {
        console.error("Error loading port data", error);
      }
  }

    // ==========================
  //  LÓGICA DINÁMICA (Backend)
  // ==========================

  /**
   * Recibe todos los datos del backend y orquesta el renderizado.
   */
  applyDynamicData(dynamicData) {
    const { vesselVisitNotifications, resources, docks, storageAreas } = dynamicData || {};

    console.log("Applying Dynamic Data:", dynamicData);

    // 1. Mapear posiciones de los Docks (NO MODIFICADO)
    const dockPositions = {}; 
    if (docks && Array.isArray(docks)) {
      docks.forEach((dock, index) => {
        // Tu fórmula original: -80 + (index * 110)
        const position = new THREE.Vector3(-80 + (index * 110), 2.25, 0); 
        dockPositions[dock.id] = position;
        this.addBuildingFromBackend(dock, position, "Dock");
      });
    }

    // 2. Renderizar Warehouses (NO MODIFICADO)
    if (storageAreas && Array.isArray(storageAreas)) {
      storageAreas.forEach((area, index) => {
        const position = new THREE.Vector3(-100 + (index * 70), 2, -170);
        this.addBuildingFromBackend(area, position, "Warehouse");
      });
    }

    // 3. Renderizar Barcos (NO MODIFICADO)
    if (vesselVisitNotifications) {
      const activeVisits = vesselVisitNotifications.filter(v => 
         v.status === "Approved" || v.status === "Arrived"
      );
      const dockQueueCounter = {}; 

      activeVisits.forEach((visit) => {
        const rawDockId = visit.assignedDockId || visit.AssignedDockId;
        if (!rawDockId) return;

        const visitDockId = String(rawDockId);
        const assignedDockPos = dockPositions[visitDockId];
        
        if (assignedDockPos) {
          const queueIndex = dockQueueCounter[visitDockId] || 0;
          dockQueueCounter[visitDockId] = queueIndex + 1;
          const zSeparation = 50 + (queueIndex * 50); 
          const vesselPos = new THREE.Vector3(assignedDockPos.x, 5, assignedDockPos.z + zSeparation);
          this.addVesselFromBackend(visit, vesselPos);
        }
      });
    }

    // 4. Renderizar Recursos (REESCRITO SOLO ESTO)
    if (resources && Array.isArray(resources)) {
      
      // Filtramos para tratarlos por separado
      const cranes = resources.filter(r => (r.type || r.name || "").toLowerCase().includes("crane"));
      const trucks = resources.filter(r => (r.type || r.name || "").toLowerCase().includes("truck"));

      // A) GRÚAS: Las ponemos ENTRE los Docks
      // Si el Dock está en X, la Grúa va a X + 55 (mitad de 110)
      cranes.forEach((crane, index) => {
        // Usamos la misma lógica base que los Docks (-80 + index*110) pero sumamos 55
        const xPos = -80 + (index * 110) + 55;
        
        // Misma altura y Z que los Docks para que estén en línea
        const position = new THREE.Vector3(xPos, 2, -2); 
        this.addResourceFromBackend(crane, position);
      });

      // B) CAMIONES: Detrás de las grúas
      trucks.forEach((truck, index) => {
        // Los ponemos más juntos (cada 40m) empezando alineados a la izquierda
        const xPos = -80 + (index * 40);
        
        // Z = -55 (Detrás de Docks/Grúas que están en 0, pero delante de Warehouses que están en -110)
        const position = new THREE.Vector3(xPos, 2, -55); 
        this.addResourceFromBackend(truck, position);
      });
    }

    // 5. CONSTRUIR CARRETERA (NUEVO BLOQUE)
    // =========================================================
    // La carretera va en Z = -55 (donde están los camiones)
    const roadZ = -55;
    
    this.loader.load("/models/road.glb", (gltf) => {
        const originalRoad = gltf.scene;
        
        // Ajusta la escala según tu modelo road.glb (prueba con 1, 2 o 5)
        const scale = 25.0; 
        originalRoad.scale.set(scale, scale, scale);

        // Definimos de dónde a dónde va la carretera (cubriendo todo el puerto)
        // Ejemplo: Desde X=-300 hasta X=300
        const startX = -295;
        const endX = 450;
        const tileSize = 9; // Ajusta esto según el largo de tu bloque de carretera

        for (let x = startX; x <= endX; x += tileSize) {
            const roadTile = originalRoad.clone();
            
            // Posición: X variable, Y un poco sobre el suelo, Z fijo en -55
            roadTile.position.set(x, 2, roadZ); 
            
            // Si la carretera sale girada 90 grados, descomenta esto:
            // roadTile.rotation.y = Math.PI / 2; 

            roadTile.traverse((node) => {
                if (node.isMesh) node.receiveShadow = true;
            });

            this.scene.add(roadTile);
            // (Opcional) Guardar en array para poder borrarlas luego si recargas
            // this.dynamicObjects.buildings.push(roadTile); 
        }
    }, undefined, (error) => console.warn("Error cargando road.glb", error));
  }

  // ---------------------------------------------------------
  // MÉTODO NUEVO: Carga genérica de edificios (Docks/Warehouses)
  // ---------------------------------------------------------
  addBuildingFromBackend(entity, position, type) {
    let modelPath = "";
    let scale = 1.0;

    if (type === "Dock") {
      modelPath = "/models/dock.glb"; // Asegúrate que este archivo existe
      scale = 15.0; // Ajusta según el tamaño de tu modelo
    } else if (type === "Warehouse") {
      modelPath = "/models/warehouse.glb";
      scale = 0.7;
    } else if (type === "Yard") {
      modelPath = "/models/base.glb";
      scale = 1.0;
    }

    this.loader.load(
      modelPath,
      (gltf) => {
        const object = gltf.scene;
        object.position.copy(position);
        object.scale.set(scale, scale, scale);

        // Sombras
        object.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        // --- INTERACTIVIDAD (PICKING) ---
        let buildingInfo = {};

        if (type === "Dock") {
            // REGLAS PARA DOCKS: Name y Location
            buildingInfo = {
                type: "Dock",
                name: entity.dockName || "Dock",
                location: entity.dockLocation || `Coords (${Math.round(position.x)}, ${Math.round(position.z)})`, // Si el backend no trae location, usamos coordenadas
                id: entity.id
            };
        } else if (type === "Warehouse") {
            // REGLAS PARA STORAGE: Location y Type
            buildingInfo = {
                type: "StorageArea", // Cambiamos el string para identificarlo fácil en React
                location: entity.storageAreaLocation || entity.id, // En almacenes, a veces el nombre ES la ubicación
                storageType: entity.storageAreaType, // El requerimiento pide "Type"
                id: entity.id
            };
        } else {
             // Default
             buildingInfo = { type: "Building", name: entity.name, id: entity.id };
        }

        // 1. Lo hacemos seleccionable (resaltado)
        this.setPickable(object, buildingInfo);
        
        // 2. Lo añadimos a la lista del controlador
        this.addToPickables(object);
        // --------------------------------

        this.scene.add(object);
        this.dynamicObjects.buildings.push(object);
        console.log(`Added building [${type}]: ${entity.name || entity.id}`);
      },
      undefined,
      (error) => {
        console.warn(`Failed to load ${modelPath}, adding fallback cube.`, error);
        // Fallback visual si falla el modelo
        this.addFallbackBox(position, type === "dock" ? 0x888888 : 0x552200);
      }
    );
  }

  // ---------------------------------------------------------
  // Barcos
  // ---------------------------------------------------------
  addVesselFromBackend(visit, position) {
    const modelPath = "/models/container_ship.glb"; // O 'vessel.glb'

    this.loader.load(
      modelPath,
      (gltf) => {
        const ship = gltf.scene;
        const scale = 40.0; // Ajustar escala
        ship.scale.set(scale, scale, scale);
        ship.position.copy(position);
        
        // Rotar para que mire hacia el muelle (o paralelo)
        ship.rotation.y = Math.PI; 

        ship.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        // --- BLOQUE DE INTERACTIVIDAD ---
        // 1. Preparamos los datos que quieres mostrar al hacer click
        const infoData = {
            type: "Vessel",
            id: visit.vesselId || "Unknown ID",
            name: visit.vesselName || "Unknown Ship",
            IMO: visit.vesselIMO || visit.imo || "N/A", // <--- AÑADIDO
            status: visit.status
        };

        // 2. Marcamos el objeto y sus hijos como seleccionables
        this.setPickable(ship, infoData);

        // 3. Lo registramos en el sistema de picking
        this.addToPickables(ship);
        // --------------------------------

        this.scene.add(ship);
        this.dynamicObjects.vessels.push(ship);
        console.log(`Vessel added for visit: ${visit.vesselName}`);
      },
      undefined,
      (error) => {
        console.warn("Failed to load vessel model", error);
        this.addFallbackBox(position, 0xff0000, { x: 10, y: 5, z: 30 });
      }
    );
  }

  // ---------------------------------------------------------
  // Recursos (Grúas / Camiones)
  // ---------------------------------------------------------
  addResourceFromBackend(resource, position) {
    // Detectar tipo basado en el nombre o tipo que venga del backend
    const typeStr = (resource.type).toLowerCase();
    
    let modelPath = "";
    let scale = 1.0;

    if (typeStr.includes("crane")) {
      modelPath = "/models/crane.glb";
      scale = 2.0;
    } else if (typeStr.includes("truck")) {
      modelPath = "/models/truck.glb";
      scale = 0.25; // Los camiones suelen ser muy grandes en los modelos raw
    } else {
      // Default
      modelPath = "/models/crane.glb";
    }

    this.loader.load(
      modelPath,
      (gltf) => {
        const obj = gltf.scene;
        obj.position.copy(position);
        obj.scale.set(scale, scale, scale);

        obj.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        // --- INTERACTIVIDAD (PICKING) ---
        const resourceInfo = {
            type: "Resource",
            //type: type,     // "Crane" o "Truck"
            id: resource.id || resource.code,
            description: resource.description,
            tipo: resource.type,
            name: resource.code
            
            
        };

        // 1. Lo hacemos seleccionable
        this.setPickable(obj, resourceInfo);

        // 2. Lo añadimos a la lista
        this.addToPickables(obj);
        // --------------------------------



        this.scene.add(obj);
        this.dynamicObjects.resources.push(obj);
      },
      undefined,
      (error) => {
        console.warn("Failed to load resource model", error);
        this.addFallbackBox(position, 0xffff00, { x: 2, y: 4, z: 2 });
      }
    );
  }

  // Helper para cuando falla un modelo 3D
  addFallbackBox(position, color, size = { x: 10, y: 10, z: 10 }) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    
    cube.position.copy(position);
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    this.scene.add(cube);
    // Lo guardamos en buildings por defecto para tener referencia
    this.dynamicObjects.buildings.push(cube);
  }

  // ==========================
  //  Original code
  // ==========================

  // Brighter lights
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

    // Sky background
    this.scene.background = new THREE.Color(config.hemisphere.skyColor);

    this.scene.fog = new THREE.Fog(0xa0d8ef, 220, 2000);
    console.log("Lighting setup complete (Ambient + Directional + Hemisphere + Sky)");
  }

  buildFacility(facility) {
    //Imported models
    if (
      facility.type === "vessel" ||
      facility.type === "container_stack" ||
      facility.type === "crane"
    ) {
      this.loadModelForFacility(facility);
      return;
    }

    //Simple procedural objects
    this.buildProceduralBlock(facility);
  }
  //Simple objects (dock)
  buildProceduralBlock(facility) {
    const width = facility.dimensions.width;
    const height = facility.dimensions.depth;
    const length = facility.dimensions.length;

    const geometry = new THREE.BoxGeometry(width, height, length);

    const repeatU = width / 2;
    const repeatV = length / 2;
    const materialConfig = this.data.materials.dock;
    const material = this.materialManager.createMaterial(
      materialConfig,
      repeatU,
      repeatV
    );
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      facility.position.x,
      facility.position.y + height / 2,
      facility.position.z
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.setPickable(mesh, { type: facility.type || "facility", id: facility.id, name: facility.name });
    this.addToPickables(mesh);

    this.scene.add(mesh);
  }


  setPickable(object3D, userData) {
    // Assign userData to the top-level object
    object3D.userData = { pickable: true, ...userData };

    object3D.traverse(node => {
      if (node.isMesh) {
        node.userData = { pickable: true, ...userData };
        if (Array.isArray(node.material)) node.material.forEach(m => m.emissive ??= new THREE.Color(0x000000));
        else node.material.emissive ??= new THREE.Color(0x000000);
      }
    });
  }


  addToPickables(object3D) {
    if (!this.cameraController || !object3D.userData?.pickable) return;
    this.cameraController.pickables.push(object3D);
  }

  // Make the sea
  buildWater() {
    const geometry = new THREE.PlaneGeometry(10000, 10000);

    const repeatU = 100;
    const repeatV = 100;

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
    Object.values(this.lights).forEach((light) => this.scene.remove(light));
    this.lights = {};
  }
}
