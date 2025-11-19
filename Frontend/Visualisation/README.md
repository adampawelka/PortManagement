# Overview
This module implements a 3D visualization component for the Port Management Single Page Application (SPA). It allows users to interact with a visual representation of the port environment directly in the web interface.

### Tools:
- 3D Engine - Three.js
- SPA Framework - React
- Package Manager - npm
- Build / Dev Tools - Vite
- Version Control - Git

# User Story 3.3.1: 
As a Project Manager, I want the team to develop and integrate a 3D visualization module into the SPA, so that users can begin interacting with a visual representation of the port environment.

### 

### 3D Engine Setup

- Libraries used:`three`, `lodash`
Install it with the following commands: 
`npm install three`
`npm install lodash`

Provides a framework for creating 3D scenes in the browser using WebGL.

### Scene Construction

A single rotating cube has been added to represent a placeholder 3D object and to verify rendering.

### Component Integration

- **SPA Embedding**: Integrated the 3D module as a standard React component.
- **Routing**: Accessible via SPA route (`/visualisation`).
- **Purpose**: Keeps the SPA modular, allowing independent development and testing of the 3D module.


### Performance and Error Handling
- **Lazy Loading**: The component is loaded only when its route is accessed, reducing initial SPA load.
- **Error Boundaries**: Implemented to catch rendering errors and prevent SPA crashes. - TODO
- **Resource Management** Renderer and event listeners are properly cleaned up on component unmount.

### Initial Testing
- **Render Verification**: Confirmed that the cube renders correctly and rotates smoothly.
- **Functional Checks**: Verified that routing, SPA layout, and authentication remain unaffected.
- **Logging**: Console outputs confirm no runtime errors.


# User Story 3.3.2: Render Port Structure from Data

As a System User, I want to see a 3D representation of the port structure (docks, container yards and warehouses) based on real data, so that I can visualize the physical layout accurately.

---

### Data Consumption & Modeling Logic

This module provides the necessary visual components to render the static elements of the port, transforming layout data into 3D geometry.

* **Key File Created:** `Frontend/public/port-layout.json`
* **Modeling Technique:** Procedural Modeling (BoxGeometry) is used for basic structures (Docks, Water Plane) while the **GLTFLoader** is used for complex assets (Vessels, Cranes).

### ### Component Integration & Data Flow

* **Module Implemented:** The core logic resides in the `PortBuilder.js` class, created within the `Frontend/Visualisation` directory.
* **Initialization:** The `PortBuilder` module is initialized in the main application loop (`thumb_raiser.js`) by passing the global Three.js scene object:
    ```javascript
    const portBuilder = new PortBuilder(this.scene3D);
    portBuilder.loadPortData();
    ```
* **Data Retrieval:** The data is retrieved asynchronously via `fetch` from the static file: `/port-layout.json`.
* **Data Mapping:** The module maps the `id`, `position`, and `dimensions` attributes from the JSON to create and position the corresponding 3D meshes (Docks, Cranes, Ships).

### ### Asynchronous Loading & Error Handling

* **Async Asset Loading:** The primary method, `loadPortData()`, is asynchronous (`async/await`) to ensure the main application thread is not blocked while:
    * Fetching the `port-layout.json` file.
    * Loading external assets (`.glb` files) via `GLTFLoader`.
* **Internal Error Handling:** A `try...catch` block is implemented within the primary loading sequence to manage potential network failures (e.g., failed `fetch`) or parsing errors in the GLB files, preventing application crashes.
* **Scale and Positioning:** Logic was added in `loadModelForFacility` to apply specific `scale` and `yOffset` adjustments to downloaded models to correct their arbitrary units.

### ### Verification and Functional Checks

* **Data Integrity Check:** Verified that the module successfully fetches and parses the data by adding console logs for each facility being built.
* **Rendering Check:** The module successfully renders multiple object types simultaneously.
* **Environment Setup:** Configured `scene.background` and `scene.fog` to ensure a realistic, illuminated atmosphere that blends the scene into the horizon.


# User Story 3.3.3

# User Story 3.3.4

# User Story 3.3.5

# User Story 3.3.6
As a System User, I want to control a perspective camera using the mouse, so that I can freely explore the scene and inspect objects from different angles.

### Features

**Mouse rotation:**: 
Right-click and drag to orbit the camera horizontally and vertically around the target. Rotation is constrained vertically to avoid flipping below the floor or above the horizon.

**Mouse zoom:**
Left-click and drag vertically or use the mouse wheel to zoom the camera in and out.
Zoom limits prevent the camera from getting too close or too far from the target.

**Floor boundary enforcement:**
Prevents the camera from going below a defined floor level, maintaining a natural viewpoint.

**Clean event handling:**
Adds and removes event listeners on the renderer’s DOM element for mouse actions.
