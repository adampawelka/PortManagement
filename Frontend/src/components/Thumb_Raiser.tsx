import react from "react";
import "../styles/App.css";

import Orientation from "../../Visualisation/Basic_Thumb_Raiser/orientation";
import * as THREE from "three";
import ThumbRaiser from "../../Visualisation/Basic_Thumb_Raiser/thumb_raiser";

const ThumbRaiserComponent = (): React.JSX.Element => {
  react.useEffect(() => {
    console.log("Initialize ThumbRaiser 3D scene");

    // 1. Crear la instancia del motor 3D
    const thumbRaiser = new ThumbRaiser(
      {}, // General Parameters
      { scale: new THREE.Vector3(1.0, 0.5, 1.0) }, // Maze parameters
      {
        ambientLight: { intensity: 0.1 },
        pointLight1: {
          intensity: 50.0,
          distance: 20.0,
          position: new THREE.Vector3(-3.5, 10.0, 2.5),
        },
        pointLight2: {
          intensity: 50.0,
          distance: 20.0,
          position: new THREE.Vector3(3.5, 10.0, -2.5),
        },
      }, // Lights parameters
      {
        view: "third-person",
        multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5),
        initialOrientation: new Orientation(0.0, -20.0),
        initialDistance: 2.0,
        distanceMin: 1.0,
        distanceMax: 4.0,
      } // Third-person view camera parameters
    );

    // 2. Cargar datos dinámicos desde el backend (US 3.3.3)
    const loadDynamicData = async () => {
      try {
        const [vvnRes, resRes, docksRes] = await Promise.all([
          fetch("/api/VesselVisitNotifications"),
          fetch("/api/Resources"),
          fetch("/api/Docks"),
        ]);

        if (!vvnRes.ok || !resRes.ok || !docksRes.ok) {
          console.error("Error HTTP al cargar datos para la visualización 3D", {
            vvnStatus: vvnRes.status,
            resStatus: resRes.status,
            docksStatus: docksRes.status,
          });
          return;
        }

        const [vesselVisitNotifications, resources, docks] = await Promise.all([
          vvnRes.json(),
          resRes.json(),
          docksRes.json(),
        ]);

        // Pasamos los datos al motor 3D
        thumbRaiser.loadDynamicObjects({
          vesselVisitNotifications,
          resources,
          docks,
        });
      } catch (err) {
        console.error("Error al cargar datos dinámicos para la escena 3D", err);
      }
    };

    loadDynamicData();

    // 3. Bucle de animación
    let animationFrameId: number;

    const animate = () => {
      thumbRaiser.update();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 4. Limpieza opcional (si añadís un dispose() en ThumbRaiser)
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      // Si en el futuro creáis thumbRaiser.dispose(), se llamaría aquí.
    };
  }, []);

  return (
    <>
      <div id="parent"></div>
      <canvas id="myCanvas"></canvas>
    </>
  );
};

export default ThumbRaiserComponent;
