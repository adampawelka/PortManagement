import React, { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Thumb_Raiser.css"; // Asegúrate de que este archivo no tenga estilos que oculten el canvas
import Orientation from "../../Visualisation/Basic_Thumb_Raiser/orientation";
import * as THREE from "three";
import ThumbRaiser from "../../Visualisation/Basic_Thumb_Raiser/thumb_raiser";

const ThumbRaiserComponent = (): React.JSX.Element => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  // Usamos ref solo para guardar la instancia de la clase, no para el DOM
  const thumbRaiserRef = useRef<ThumbRaiser | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    // 1. Evitar doble carga en React Strict Mode
    if (loadedRef.current || isLoading || !isAuthenticated) return;
    
    // 2. Verificación de seguridad: ¿Existe el elemento en el DOM?
    const canvasElement = document.getElementById("myCanvas");
    if (!canvasElement) {
        console.error("Canvas element not found!");
        return;
    }

    loadedRef.current = true;
    console.log("Initialize ThumbRaiser 3D scene directly looking for ID");

    // -----------------------------------------------------------
    // TU CÓDIGO ORIGINAL (Sin pasar el canvas por parámetro)
    // -----------------------------------------------------------
    const thumbRaiser = new ThumbRaiser(
      {}, 
      { scale: new THREE.Vector3(1.0, 0.5, 1.0) }, 
      {
        ambientLight: { intensity: 0.1 },
        pointLight1: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) },
        pointLight2: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) },
      }, 
      {
        view: "third-person",
        multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5),
        initialOrientation: new Orientation(0.0, -20.0),
        initialDistance: 2.0,
        distanceMin: 1.0,
        distanceMax: 4.0,
      }
      // NO pasamos el canvas aquí, ya que tu clase lo busca por ID dentro.
    );

    thumbRaiserRef.current = thumbRaiser;

    // -----------------------------------------------------------
    // CARGA DE DATOS (Igual que antes)
    // -----------------------------------------------------------
    const loadDynamicData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        // Asegúrate de que este puerto sea correcto (https vs http)
        const BASE_URL = "http://localhost:5000/api"; 

        const [vvnRes, resRes, docksRes, wareRes] = await Promise.all([
          fetch(`${BASE_URL}/VesselVisitNotifications`, { headers }),
          fetch(`${BASE_URL}/Resources`, { headers }),
          fetch(`${BASE_URL}/Docks`, { headers }),
          fetch(`${BASE_URL}/StorageAreas`, { headers }) 
        ]);

        if (vvnRes.ok && resRes.ok && docksRes.ok) {
           const data = await Promise.all([
             vvnRes.json(), 
             resRes.json(), 
             docksRes.json(), 
             wareRes.ok ? wareRes.json() : []
           ]);

           thumbRaiser.loadDynamicObjects({
             vesselVisitNotifications: data[0],
             resources: data[1],
             docks: data[2],
             storageAreas: data[3]
           });
        }
      } catch (err) {
        console.error("Error loading data", err);
      }
    };

    loadDynamicData();

    // -----------------------------------------------------------
    // ANIMATION LOOP
    // -----------------------------------------------------------
    let animationFrameId: number;
    const animate = () => {
      // Importante: chequeo de seguridad
      if (thumbRaiserRef.current) {
        thumbRaiserRef.current.update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup al desmontar
    return () => {
      cancelAnimationFrame(animationFrameId);
      loadedRef.current = false;
    };
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  if (isLoading) return <div>Loading Scene...</div>;

  return (
    <>
      <div id="parent"></div>
      
      {/* SOLUCIÓN CRÍTICA: 
         Estilos en línea para forzar al canvas a ocupar el espacio 
         y comportarse como bloque.
      */}
      <canvas 
        id="myCanvas" 
        style={{ 
            display: "block", 
            width: "100%", 
            height: "100%", 
            outline: "none" 
        }}
      ></canvas>
    </>
  );
};

export default ThumbRaiserComponent;