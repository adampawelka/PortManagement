import React, { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Thumb_Raiser.css"; // Asegúrate de que este archivo no tenga estilos que oculten el canvas
import Orientation from "../../Visualisation/Basic_Thumb_Raiser/orientation";
import * as THREE from "three";
import ThumbRaiser from "../../Visualisation/Basic_Thumb_Raiser/thumb_raiser";
import { useApi } from "../services/api"; 
import { getRoleStatus } from "../services/userService";

const ThumbRaiserComponent = (): React.JSX.Element => {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  // Usamos ref solo para guardar la instancia de la clase, no para el DOM
  const thumbRaiserRef = useRef<ThumbRaiser | null>(null);
  const loadedRef = useRef(false);
  const { apiFetch } = useApi();
  const [dbRole, setDbRole] = useState<string>("PortAuthorityOfficer");

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
    const fetchRole = async () => {
      if (!user?.sub || !apiFetch) return;

      try {      
        const data = await getRoleStatus(
            apiFetch, 
            user.sub,      // iamId     // name (opcional pero tu servicio lo acepta)
        );
        
        console.log("Respuesta de getRoleStatus:", data);

        // Ajusta esto según lo que devuelva tu backend (role, Role, userRole, etc.)
        // Viendo el nombre del endpoint, quizás devuelva un objeto con estado y rol
        const roleName = data.role || data.Role || "Administrator";
        setDbRole(roleName);
        //console.log("Rol asignado: ", dbRole);
        

      } catch (error) {
        console.error("Error obteniendo rol con getRoleStatus:", error);
      }
    };

    if (isAuthenticated) {
        fetchRole();
    }
  }, [user, isAuthenticated, apiFetch]);

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
            position: "fixed",
            top: "80px",
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
          <h3 style={{ marginTop: 0, color: "#4d3ae1ff" }}>
            {selectedInfo.type || "Element"} Info
          </h3>
          
          <div style={{ marginBottom: "10px" }}>

                                
                {selectedInfo.type === "Dock" && selectedInfo.location && (
                  <div>
                    <p style={{ margin: "4px 0" }}><strong>Name:</strong> <span style={{color: "#fff"}}>{selectedInfo.name}</span></p>
                    {selectedInfo.description && <p style={{ margin: "4px 0" }}><strong>Desc:</strong> <span style={{color: "#ccc"}}>{selectedInfo.description}</span></p>}
                    <p style={{ margin: "4px 0" }}><strong>Location:</strong> {selectedInfo.location}</p>
                  </div>
                )}
                {selectedInfo.type === "StorageArea" && selectedInfo.location && (
                  <div>
                    <p style={{ margin: "4px 0" }}><strong>Name:</strong> <span style={{color: "#fff"}}>{selectedInfo.storageType}</span></p>
                    {selectedInfo.description && <p style={{ margin: "4px 0" }}><strong>Desc:</strong> <span style={{color: "#ccc"}}>{selectedInfo.description}</span></p>}
                    <p style={{ margin: "4px 0" }}><strong>Location:</strong> {selectedInfo.location}</p>
                  </div>
                )}
                {selectedInfo.type === "Vessel" && (
                    <>
                        <p style={{ margin: "4px 0" }}><strong>Name:</strong> <span style={{color: "#fff"}}>{selectedInfo.name}</span></p>
                        {selectedInfo.description && <p style={{ margin: "4px 0" }}><strong>Desc:</strong> <span style={{color: "#ccc"}}>{selectedInfo.description}</span></p>}
                        <p style={{ margin: "4px 0" }}>Status: <strong>{selectedInfo.status}</strong></p>
                        {selectedInfo.crewMembers && selectedInfo.crewMembers.length > 0 && (
                            <div style={{ marginTop: "8px" }}>
                                <p style={{ margin: "2px 0", fontWeight: "bold" }}>Crew List:</p>
                                <ul style={{ margin: "2px 0", paddingLeft: "20px", fontSize: "13px" }}>
                                    {selectedInfo.crewMembers.map((member: any, index: number) => (
                                        // Aquí mostramos SOLO el nombre. 
                                        // Si el objeto es { name: "..." }, usa member.name
                                        // Si es un string directo, usa member
                                        <li key={index}>
                                            {member.name || member.Name || "Unnamed Member"}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {selectedInfo.cargoManifests && selectedInfo.cargoManifests.length > 0 && (
                            <div style={{ marginTop: "8px" }}>
                                <p style={{ margin: "2px 0", fontWeight: "bold" }}>Cargo Manifests:</p>
                                <ul style={{ margin: "2px 0", paddingLeft: "20px", fontSize: "13px" }}>
                                    {selectedInfo.cargoManifests.map((cargo: any, index: number) => (
                                        <li key={index}>
                                            {/* Ajusta 'cargo.id' o 'cargo.description' según tu backend */}
                                            {cargo.manifestType || "Unknown Cargo"}                              
                                            {cargo.containerIdentifiers && cargo.containerIdentifiers.length > 0 ? (
                                              <ul style={{ marginTop: "2px", paddingLeft: "15px", listStyleType: "circle", color: "#aaa" }}>
                                                  {cargo.containerIdentifiers.map((container: any, cIndex: number) => (
                                                    <li key={cIndex} style={{ fontSize: "12px" }}>
                                                        {/* Aquí pon la propiedad que quieras mostrar del contenedor (id, code, type...) */}
                                                        📦 {container || container.value || "Unknown Container"}
                                                    </li>
                                                  ))}
                                              </ul>
                                            ) : (
                                              <div style={{ fontSize: "11px", fontStyle: "italic", marginLeft: "10px", color: "#666" }}>
                                                  (Empty manifest)
                                              </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
          </div>

          
          {(dbRole === "LogisticsOperator" || dbRole === "Administrator") && (
              <div style={{ background: "rgba(152, 126, 241, 0.1)", padding: "10px", borderRadius: "6px", marginTop: "10px", borderLeft: "3px solid #4d3ae1ff" }}>
                <strong style={{ color: "#ffffffff", fontSize: "12px", textTransform: "uppercase" }}>📦 Logistics Data</strong>
              
                {selectedInfo.type === "Dock" && (
                    <div>
                     <p style={{ margin: "4px 0" }}>Length: {selectedInfo.length}</p>
                     <p style={{ margin: "4px 0" }}>Depth: {selectedInfo.depth}</p>
                     <p style={{ margin: "4px 0" }}>Max Draft: {selectedInfo.maxDraft}</p>
                     {selectedInfo.allowedVesselTypes && selectedInfo.allowedVesselTypes.length > 0 && (
                            <div style={{ marginTop: "8px" }}>
                                <p style={{ margin: "2px 0", fontWeight: "bold" }}>Allowed Vessels:</p>
                                <ul style={{ margin: "2px 0", paddingLeft: "20px", fontSize: "13px" }}>
                                    {selectedInfo.allowedVesselTypes.map((member: any, index: number) => (
                                        // Aquí mostramos SOLO el nombre. 
                                        // Si el objeto es { name: "..." }, usa member.name
                                        // Si es un string directo, usa member
                                        <li key={index}>
                                            {member.name || member.Name || "Unnamed Member"}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                {selectedInfo.type === "StorageArea" && (
                    <>
                        <p style={{ margin: "4px 0" }}>Capacity: {selectedInfo.maxCapacity}</p>
                        <p style={{ margin: "4px 0" }}>Occupancy: {selectedInfo.occupancy}</p>
                    </>
                )}
                 {selectedInfo.type === "Resource" && (
                    <div>
                     <p style={{ margin: "4px 0" }}><strong>Name:</strong> <span style={{color: "#fff"}}>{selectedInfo.name}</span></p>
                     {selectedInfo.description && <p style={{ margin: "4px 0" }}><strong>Desc:</strong> <span style={{color: "#ccc"}}>{selectedInfo.description}</span></p>}
                     <p style={{ margin: "4px 0" }}>Status: {selectedInfo.status}</p>
                     <p style={{ margin: "4px 0" }}>Set Up Time: {selectedInfo.setupTime}</p>
                    </div>
                )}
              </div>
            )}
            {/* --- SECCIÓN ESPECÍFICA: PORT AUTHORITY --- */}
            {(dbRole === "PortAuthorityOfficer" || dbRole === "Administrator") && (
              <div style={{ background: "rgba(255, 99, 71, 0.1)", padding: "10px", borderRadius: "6px", marginTop: "10px", borderLeft: "3px solid #ff6347" }}>
                <strong style={{ color: "#ff6347", fontSize: "12px", textTransform: "uppercase" }}>👮 Port Authority Data</strong>
                
                
                {selectedInfo.type === "Dock" && (
                    <div>
                     <p style={{ margin: "4px 0" }}>Length: {selectedInfo.length}</p>
                     <p style={{ margin: "4px 0" }}>Depth: {selectedInfo.depth}</p>
                     <p style={{ margin: "4px 0" }}>Max Draft: {selectedInfo.maxDraft}</p>
                     {selectedInfo.allowedVesselTypes && selectedInfo.allowedVesselTypes.length > 0 && (
                            <div style={{ marginTop: "8px" }}>
                                <p style={{ margin: "2px 0", fontWeight: "bold" }}>Allowed Vessels:</p>
                                <ul style={{ margin: "2px 0", paddingLeft: "20px", fontSize: "13px" }}>
                                    {selectedInfo.allowedVesselTypes.map((member: any, index: number) => (
                                        // Aquí mostramos SOLO el nombre. 
                                        // Si el objeto es { name: "..." }, usa member.name
                                        // Si es un string directo, usa member
                                        <li key={index}>
                                            {member.name || member.Name || "Unnamed Member"}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
              </div>
            )}
                     
        </div>
      )}
    </>
  );
};

export default ThumbRaiserComponent;