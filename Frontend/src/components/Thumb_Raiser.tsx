import React, { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Thumb_Raiser.css"; // Asegúrate de que este archivo no tenga estilos que oculten el canvas
import Orientation from "../../Visualisation/Basic_Thumb_Raiser/orientation";
import * as THREE from "three";
import ThumbRaiser from "../../Visualisation/Basic_Thumb_Raiser/thumb_raiser";

const ThumbRaiserComponent = (): React.JSX.Element => {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  // Usamos ref solo para guardar la instancia de la clase, no para el DOM
  const thumbRaiserRef = useRef<ThumbRaiser | null>(null);
  const loadedRef = useRef(false);

  const [selectedInfo, setSelectedInfo] = useState<any>(null); // Datos del objeto seleccionado
  const [showOverlay, setShowOverlay] = useState(false);       // Visibilidad del panel

  // 1. Función que recibe los datos desde el mundo 3D
  const handleObjectSelected = (data: any) => {
    console.log("4. Objeto seleccionado:", data);
    setSelectedInfo(data);
    
    // Opcional: Si quieres que se abra automáticamente al hacer clic, descomenta esto:
    //if (data) setShowOverlay(true);
    // else setShowOverlay(false);
  };


  // 2. Listener para la tecla "i"
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "i") {
        // Solo hacemos toggle si hay algo seleccionado
        if (selectedInfo) {
          setShowOverlay((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedInfo]); // Dependencia importante: selectedInfo

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
      },
      handleObjectSelected
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
  // 2. FUNCIÓN PARA OBTENER EL ROL
  const getUserRole = () => {
    if (!user) return null;

    // OPCIÓN A: Si has configurado Auth0 para poner roles en el namespace estándar
    // Cambia la URL por la que hayas configurado en tu Auth0 Action/Rule
    // return user['https://tu-proyecto/roles']?.[0];

    // OPCIÓN B: Para probar AHORA MISMO (Simulación)
    // Descomenta el que quieras probar:
    // return "Administrator";
    // return "PortAuthorityOfficer";
    return "LogisticsOperator"; 
  };

  const userRole = getUserRole();

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
      {/* --- PANEL DE INFORMACIÓN (OVERLAY) --- */}
      {showOverlay && selectedInfo && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "300px",
            pointerEvents: "none", // IMPORTANTE: Permite hacer clic/mover cámara a través del panel
            zIndex: 10,
            fontFamily: "Arial, sans-serif",
            border: "1px solid #444"
          }}
        >
          <h3 style={{ marginTop: 0, color: "#4fa3ff" }}>
            {selectedInfo.type || "Element"} Info
          </h3>
          
          <div style={{ fontSize: "14px", lineHeight: "1.8", marginTop: "10px" }}>
            
            {/* 1. CASO DOCK: Name, Location */}
            {selectedInfo.type === "Dock" && (
                <>
                    <p><strong>Name:</strong> {selectedInfo.name}</p>
                    <p><strong>Location:</strong> {selectedInfo.location}</p>
                </>
            )}

            {/* 2. CASO STORAGE AREA: Location, Type */}
            {selectedInfo.type === "StorageArea" && (
                <>
                    <p><strong>Location:</strong> {selectedInfo.location}</p>
                    <p><strong>Type:</strong> {selectedInfo.storageType}</p>
                </>
            )}

            {/* 3. CASO RESOURCE: Name, Description, Type */}
            {selectedInfo.type === "Resource" && (
                <>
                    <p><strong>Name:</strong> {selectedInfo.name}</p>
                    <p><strong>Type:</strong> {selectedInfo.tipo}</p>
                    <p><strong>Description:</strong> {selectedInfo.description}</p>
                </>
            )}

            {/* 4. CASO VESSEL: Name, IMO */}
            {selectedInfo.type === "Vessel" && (
                <>
                    <p><strong>Name:</strong> {selectedInfo.name}</p>
                    <p><strong>IMO:</strong> {selectedInfo.IMO}</p>
                </>
            )}

            {/* DEBUG: Mostrar ID siempre para desarrollo (puedes quitarlo luego) */}
            <hr style={{borderColor: "#333", margin: "10px 0"}}/>
            <p style={{ fontSize: "12px", color: "#888" }}>System ID: {selectedInfo.id}</p>

          </div>
        </div>
      )}
    </>
  );
};

export default ThumbRaiserComponent;