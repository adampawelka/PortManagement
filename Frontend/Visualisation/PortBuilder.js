import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MaterialManager } from "./Basic_Thumb_Raiser/materials.js";

export class PortBuilder {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader(); // Model loader
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
      console.log("Realistic port loaded.");
    } catch (error) {
      console.error("Error loading port-layout.json:", error);
    }
  }

  // ==========================
  //  NEW: dynamic data
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
      console.warn("applyDynamicData: missing VVN or Resources data");
      return;
    }

    //Build a map dockId: approximate position in the port
    const dockPositionMap = this.buildDockPositionMap(docks);

    //Vessels with Approved status and assigned dock 
    const approvedVisits = vesselVisitNotifications.filter((v) => {
      return (
        v.status === "Approved" &&
        v.assignedDockId &&
        dockPositionMap[v.assignedDockId]
      );
    });

    approvedVisits.forEach((visit, index) => {
      const dockPos = dockPositionMap[visit.assignedDockId];
      this.addVesselFromBackend(visit, dockPos, index);
    });

    // Resources with assigned area 
    const resourcesWithArea = resources.filter((r) => {
      // Adjust these to your DTO fields:
      return r.assignedAreaCode || r.assignedAreaName || r.assignedAreaId;
    });

    resourcesWithArea.forEach((resource, index) => {
      const areaPos = this.getDefaultAreaPosition(index);
      this.addResourceFromBackend(resource, areaPos);
    });
  }

  // Maps each dockId to a base position in the port
  buildDockPositionMap(docks) {
    const map = {};

    if (!docks || docks.length === 0) {
      return map;
    }

    // Base positions you can adapt to your real port layout
    const basePositions = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(160, 0, 0),
      new THREE.Vector3(-160, 0, 0),
    ];

    docks.forEach((dock, index) => {
      // Adjust: assuming dock.id
      const id = dock.id || dock.Id;
      if (!id) return;

      const base = basePositions[index % basePositions.length];
      // Slight Z variation to place multiple vessels in one dock
      map[id] = new THREE.Vector3(base.x, base.y, base.z + index * 10);
    });

    return map;
  }

  getDefaultAreaPosition(index) {
    // Default positions for cranes/resources
    const x = -80 + (index % 4) * 40;
    const z = -40 - Math.floor(index / 4) * 40;
    return new THREE.Vector3(x, 0, z);
  }

  // addVesselFromBackend(visit, position, index) {
  //   if (!position) return;

  //   // Select a model depending on vessel type (optional)
  //   const modelPath = "/models/container_ship.glb";

  //   this.loader.load(
  //     modelPath,
  //     (gltf) => {
  //       const ship = gltf.scene;
  //       ship.scale.set(scale, scale, scale);
  //       ship.position.copy(position);
  //       ship.rotation.y = Math.PI;

  //       this.setPickable(ship, { type: "vessel", visitId: visit.id, assignedDockId: visit.assignedDockId });
  //       this.scene.add(ship);

  //       // ✅ Add to dynamicObjects
  //       this.dynamicObjects.vessels.push(ship);

  //       // ✅ Add to cameraController pickables here
  //       if (this.cameraController) {
  //         this.cameraController.pickables.push(ship);
  //       }

  //       console.log("Vessel added for visit:", visit.id);
  //     }
  //   );

  // }

  // addResourceFromBackend(resource, position) {
  //   if (!position) return;

  //   // Adjust this to your DTO: type or resourceType
  //   const type = (resource.type || resource.resourceType || "").toLowerCase();

  //   let modelPath = "";
  //   if (type.includes("crane")) {
  //     modelPath = "/models/crane.glb";
  //   } else if (type.includes("truck")) {
  //     modelPath = "/models/truck.glb";
  //   }

  //   if (modelPath) {
  //     this.loader.load(
  //       modelPath,
  //       (gltf) => {
  //         const obj = gltf.scene;
  //         const scale = type.includes("crane") ? 1.2 : 2.5;
  //         obj.scale.set(scale, scale, scale);
  //         obj.position.copy(position);

  //         obj.traverse((node) => {
  //           if (node.isMesh) {
  //             node.castShadow = true;
  //             node.receiveShadow = true;
  //           }
  //         });

  //         obj.userData = {
  //           pickable: true,
  //           type: "resource",
  //           resourceId: resource.id || resource.code,
  //           resourceType: type,
  //         };

  //         this.scene.add(obj);

  //         // ✅ Add to dynamicObjects
  //         this.dynamicObjects.resources.push(obj);

  //         // ✅ Add to cameraController pickables here
  //         if (this.cameraController) {
  //           this.cameraController.pickables.push(obj);
  //         }

  //         console.log("Resource added:", resource.code || resource.id);
  //       }
  //     );

  //   } else {
  //     this.addResourceFallbackCube(resource, position);
  //   }
  // }

  // addResourceFallbackCube(resource, position) {
  //   const geometry = new THREE.BoxGeometry(10, 20, 10);
  //   const material = new THREE.MeshStandardMaterial({ color: 0x00aaee });
  //   const cube = new THREE.Mesh(geometry, material);

  //   cube.position.copy(position);
  //   cube.castShadow = true;
  //   cube.receiveShadow = true;

  //   cube.userData = {
  //     pickable: true,
  //     type: "resource",
  //     resourceId: resource.id || resource.code,
  //   };
  //   this.scene.add(cube);
  //   this.dynamicObjects.resources.push(cube);
  // }

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

    this.scene.fog = new THREE.Fog(0xa0d8ef, 40, 135);
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

  //For imported models
  loadModelForFacility(facility) {
    let modelPath = "";
    let scale = 1;
    let rotationY = 0;
    let yOffset = 0;

    // Models
    if (facility.id === "BIG_CARGO") {
      modelPath = "/models/container_ship.glb";
      scale = 40.0;
      rotationY = Math.PI;
      yOffset = 6.0;
    } else if (facility.id === "SMALL_BOAT") {
      modelPath = "/models/fishing_boat.glb";
      scale = 4.0;
      rotationY = -Math.PI / 2;
      yOffset = 3.0;
    } else if (facility.type === "container_stack") {
      modelPath = "/models/container_stack.glb";
      scale = 2.5;
      yOffset = 2.15;
    } else if (facility.type === "crane") {
      modelPath = "/models/crane.glb";
      scale = 1.2;
      yOffset = 0.0;
      rotationY = Math.PI / 2;
    }

    if (!modelPath) return;

    this.loader.load(modelPath, (gltf) => {
      const model = gltf.scene;

      model.position.set(
        facility.position.x,
        facility.position.y + yOffset,
        facility.position.z
      );
      model.scale.set(scale, scale, scale);
      model.rotation.y = rotationY;

      this.setPickable(model, { type: facility.type, id: facility.id, name: facility.name });
      this.addToPickables(model);

      this.scene.add(model);
      console.log(`Loaded: ${facility.name}`);
    });
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
