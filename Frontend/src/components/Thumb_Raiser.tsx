import react, { useState } from "react";
import '../styles/Thumb_Raiser.css';

import Orientation from '../../Visualisation/Basic_Thumb_Raiser/orientation';
import * as THREE from "three";
import ThumbRaiser from "../../Visualisation/Basic_Thumb_Raiser/thumb_raiser";

export default (): React.JSX.Element => {

    react.useEffect(() => {
        console.log("Initialize");
        // Create the game
        const thumbRaiser = new ThumbRaiser(
            {}, // General Parameters
            { scale: new THREE.Vector3(1.0, 0.5, 1.0) }, // Maze parameters
            { ambientLight: { intensity: 0.1 }, pointLight1: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) }, pointLight2: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) } }, // Lights parameters
            { view: "third-person", multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -20.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 }, // Third-person view camera parameters
        );

        function animate() {
            requestAnimationFrame(animate);
            // Update the game
            thumbRaiser.update();
        }

        animate();

    }, []);
    
    return <>
    
        <div id="parent">
        </div>
        <canvas id="myCanvas"></canvas> 
    </>
}
