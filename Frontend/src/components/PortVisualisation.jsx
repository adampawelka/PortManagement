import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Orientation from "visualisation/Port_Visualisation/orientation.js";
import "visualisation/lodash/lodash.js"; // side-effect import
import Port from "visualisation/Port_Visualisation/port_visualisation.js";
import "../styles/PortVisualisation.css";

const PortVisualisation = () => {
    const mountRef = useRef(null);
    const portRef = useRef(null);
    const frameIdRef = useRef(null);

    const [horizontal, setHorizontal] = useState(0);
    const [vertical, setVertical] = useState(-20);
    const [distance, setDistance] = useState(2);
    const [zoom, setZoom] = useState(1);
    const [view, setView] = useState("third-person");
    const [projection, setProjection] = useState("perspective");
    const [subwindows, setSubwindows] = useState({
        userInterface: false,
        help: false,
        statistics: false,
    });

    // Initialize Port after DOM renders
    useEffect(() => {
        const initializePort = () => {
            try {
                if (typeof window._ === "undefined") {
                    throw new Error("Lodash is required for Port visualization.");
                }

                if (!mountRef.current) throw new Error("Mount ref is null");

                const portInstance = new Port(
                    { container: mountRef.current }, // <-- przekazanie kontenera
                    {
                        view: "third-person",
                        multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5),
                        initialOrientation: new Orientation(horizontal, vertical),
                        initialDistance: distance,
                        distanceMin: 1.0,
                        distanceMax: 4.0,
                    }
                );
                portRef.current = portInstance;

                const animate = () => {
                    portInstance.update();
                    frameIdRef.current = requestAnimationFrame(animate);
                };
                animate();
            } catch (err) {
                console.error("Failed to initialize Port visualization:", err);
            }
        };

        const timeoutId = setTimeout(initializePort, 0);
        return () => {
            clearTimeout(timeoutId);
            if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
            if (portRef.current) {
                const container = document.getElementById("parent") || document.body;
                // Clean up renderer and statistics
                if (portRef.current.renderer?.domElement) container.removeChild(portRef.current.renderer.domElement);
                if (portRef.current.statistics?.dom) container.removeChild(portRef.current.statistics.dom);
                if (portRef.current.renderer) portRef.current.renderer.dispose();
                if (portRef.current.scene3D) {
                    portRef.current.scene3D.traverse(obj => {
                        if (obj.geometry) obj.geometry.dispose();
                        if (obj.material) {
                            if (obj.material.map) obj.material.map.dispose();
                            obj.material.dispose();
                        }
                    });
                }
                window.removeEventListener("resize", portRef.current.windowResize);
            }
        };
    }, []);

    // PortVisualisation.jsx

    // PortVisualisation.jsx - Return Block (Complete and Corrected)

    return (
        <div id="parent" ref={mountRef}>
            <div id="viz-container"></div>

            {/* Hidden inputs/selects required by Port */}
            <input id="step" type="number" style={{ display: "none" }} />
            <input id="horizontal" type="number" style={{ display: "none" }} />
            <input id="vertical" type="number" style={{ display: "none" }} />
            <input id="distance" type="number" style={{ display: "none" }} />
            <input id="zoom" type="number" style={{ display: "none" }} />
            
            {/* Must be <select> for options.selectedIndex property */}
            <select id="view" style={{ display: "none" }}>
                <option value="third-person">Third-Person</option>
            </select>
            <select id="projection" style={{ display: "none" }}>
                <option value="perspective">Perspective</option>
                <option value="orthographic">Orthographic</option>
            </select>
            
            {/* Reset buttons */}
            <input id="reset" type="button" style={{ display: "none" }} />
            <input id="reset-all" type="button" style={{ display: "none" }} />
            
            {/* 💡 REQUIRED FIX: Checkboxes (Used in elementChange and setVisibility functions) */}
            <input id="user-interface" type="checkbox" style={{ display: "none" }} />
            <input id="help" type="checkbox" style={{ display: "none" }} />
            <input id="statistics" type="checkbox" style={{ display: "none" }} />

            {/* Containers/Panels (Referenced for style/visibility in Port methods) */}
            <div id="views-panel" style={{ display: "none" }}></div>
            <div id="subwindows-panel" style={{ display: "none" }}></div>
            <div id="help-panel" style={{ display: "none" }}></div>
            <div id="help-table" style={{ display: "none" }}></div> {/* Referenced in buildHelpPanel() */}

        </div>
    );
};

export default PortVisualisation;