// src/components/ThumbRaiser/ThumbRaiser.tsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import Orientation from "../../Visualisation/Thumb_Raiser/orientation";
import ThumbRaiser from '../../Visualisation/Thumb_Raiser/thumb_raiser.js';
import ThumbRaiserUI from "./Thumb_RaiserUI.js";

const ThumbRaiserComponent: React.FC = () => {
 // const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const getCanvas = () => canvasRef.current!;

  
  useEffect(() => {
    //if (!containerRef.current) return;
    const canvas = getCanvas();

    // Create the game instance
    const game = new ThumbRaiser(
      {}, // General Parameters
      { scale: new THREE.Vector3(1.0, 0.5, 1.0) }, // Maze parameters
      {}, // Player parameters
      {
        ambientLight: { intensity: 0.1 },
        pointLight1: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) },
        pointLight2: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) }
      }, // Lights
      {}, // Fog
      { view: "fixed", multipleViewsViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5) },
      { view: "first-person", multipleViewsViewport: new THREE.Vector4(1.0, 1.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -10.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 },
      { view: "third-person", multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -20.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 },
      { view: "top", multipleViewsViewport: new THREE.Vector4(1.0, 0.0, 0.45, 0.5), initialOrientation: new Orientation(0.0, -90.0), initialDistance: 4.0, distanceMin: 1.0, distanceMax: 16.0 },
      { view: "mini-map", multipleViewsViewport: new THREE.Vector4(0.99, 0.02, 0.3, 0.3), initialOrientation: new Orientation(180.0, -90.0), initialZoom: 0.64 }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      game.update();
    };

    animate();

    
  }, []);

  return <canvas ref={canvasRef} className="cube-canvas" />;
  //return <div ref={containerRef} style={{ width: "100vw", height: "100vh", position: "relative" }} />;
};

export default ThumbRaiserComponent;
