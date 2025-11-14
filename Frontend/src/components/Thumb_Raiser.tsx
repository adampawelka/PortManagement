import react, { useState } from "react";
import '../styles/App.css';

import Orientation from '../../Visualisation/Basic_Thumb_Raiser/orientation';
import * as THREE from 'three'
import ThumbRaiser from "../../Visualisation/Basic_Thumb_Raiser/thumb_raiser";

export default (): React.JSX.Element => {

    react.useEffect(() => {
        console.log("Initialize");
        // Create the game
        const thumbRaiser = new ThumbRaiser(
            {}, // General Parameters
            { scale: new THREE.Vector3(1.0, 0.5, 1.0) }, // Maze parameters
            {}, // Player parameters
            { ambientLight: { intensity: 0.1 }, pointLight1: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) }, pointLight2: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) } }, // Lights parameters
            {}, // Fog parameters
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
          <div id="views-panel">
              <table className="views">
                <tbody>
                  <tr>
                      <td>
                          <label>View:</label>
                          <select id="view">
                              <option value="fixed">Fixed</option>
                              <option value="first">First-person</option>
                              <option value="third">Third-person</option>
                              <option value="top">Top</option>
                          </select>
                      </td>
                      <td>
                          <label>Orientation (h):</label>
                          <input type="number" id="horizontal" required></input>
                      </td>
                      <td>
                          <label>Orientation (v):</label>
                          <input type="number" id="vertical" required></input>
                      </td>
                      <td>
                          <input type="button" id="reset" value="Reset view"></input>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <label>Projection:</label>
                          <select id="projection">
                              <option value="perspective">Perspective</option>
                              <option value="orthographic">Orthographic</option>
                          </select>
                      </td>
                      <td>
                          <label>Distance:</label>
                          <input type="number" id="distance" required></input>
                      </td>
                      <td>
                          <label>Zoom:</label>
                          <input type="number" id="zoom" required></input>
                      </td>
                      <td>
                          <input type="button" id="reset-all" value="Reset all views"></input>
                      </td>
                  </tr>
                  </tbody>
              </table>
          </div>
          <div id="help-panel">
              <table className="help" id="help-table">
                <tbody>
                  <tr>
                      <th colSpan={2} style={{fontSize: "3.0vmin"}}>
                          Help
                      </th>
                  </tr>
                  <tr>
                      <th colSpan={2} style={{textAlign: "left"}}>Select active view</th>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Fixed view</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>First-person view</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Third-person view</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Top view</td>
                  </tr>
                  <tr>
                      <th colSpan={2} style={{textAlign: "left"}}>Toggle view mode</th>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Single-view mode / multiple-views mode</td>
                  </tr>
                  <tr>
                      <th colSpan={2} style={{textAlign: "left"}}>Display / hide subwindows</th>
                  </tr>
                  <tr>
                      <td></td>
                      <td>User interface</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Mini-map</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Help</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Statistics</td>
                  </tr>
                  <tr>
                      <th colSpan={2} style={{textAlign: "left"}}>Move character</th>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Walk / run (modifier key)</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Turn left slowly / quickly</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Turn right slowly / quickly</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Walk / run backward</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Walk / run forward</td>
                  </tr>
                  <tr>
                      <th colSpan={2} style={{textAlign: "left"}}>Emote character</th>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Jump</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Yes</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>No</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Wave</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Punch</td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>Thumbs up</td>
                  </tr>
                  <tr>
                      <td colSpan={2} style={{textAlign: "right"}}></td>
                  </tr>
                  </tbody>
              </table>
          </div>
          <div id="subwindows-panel">
              <table className="subwindows">
                <tbody>
                  <tr>
                      <td>
                          <label>Multiple views:</label>
                          <input type="checkbox" id="multiple-views"></input>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <label>User interface:</label>
                          <input type="checkbox" id="user-interface"></input>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <label>Mini-map:</label>
                          <input type="checkbox" id="mini-map"></input>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <label>Help:</label>
                          <input type="checkbox" id="help"></input>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <label>Statistics:</label>
                          <input type="checkbox" id="statistics"></input>
                      </td>
                  </tr>
                  </tbody>
              </table>
          </div>
        </div>
        <canvas id="myCanvas"></canvas> 
    </>
}
