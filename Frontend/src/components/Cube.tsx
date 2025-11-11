// src/components/Cube/Cube.tsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Cube.css";

type CubeProps = {
  rotationSpeedX?: number;
  rotationSpeedY?: number;
  size?: number;
  texture?: string; // optional texture
  cameraZ?: number;
  fieldOfView?: number;
  nearClippingPane?: number;
  farClippingPane?: number;
};

const Cube: React.FC<CubeProps> = ({
  rotationSpeedX = 0.05,
  rotationSpeedY = 0.01,
  size = 200,
  texture,
  cameraZ = 10,
  fieldOfView = 30,
  nearClippingPane = 1,
  farClippingPane = 1000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);

  const getCanvas = () => canvasRef.current!;
  const getAspectRatio = () => getCanvas().clientWidth / getCanvas().clientHeight;

  useEffect(() => {
    // === Create Scene ===
    const canvas = getCanvas();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0000ff);
    sceneRef.current = scene;

    // === Cube + Texture ===
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = texture
      ? new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(texture) })
      : new THREE.MeshBasicMaterial({ color: "red" });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cubeRef.current = cube;

    // === Camera ===
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      getAspectRatio(),
      nearClippingPane,
      farClippingPane
    );
    camera.position.z = cameraZ;
    cameraRef.current = camera;

    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    rendererRef.current = renderer;

    // === Animation Loop ===
    let frameId: number;
    const animate = () => {
      if (cubeRef.current) {
        cubeRef.current.rotation.x += rotationSpeedX;
        cubeRef.current.rotation.y += rotationSpeedY;
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // === Resize Handler ===
    const handleResize = () => {
      const camera = cameraRef.current!;
      const renderer = rendererRef.current!;
      camera.aspect = getAspectRatio();
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // === Cleanup ===
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [rotationSpeedX, rotationSpeedY, cameraZ, fieldOfView, nearClippingPane, farClippingPane, texture]);

  return <canvas ref={canvasRef} className="cube-canvas" />;
};

export default Cube;
