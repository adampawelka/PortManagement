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


# User Story 3.3.2

# User Story 3.3.3

# User Story 3.3.4

# User Story 3.3.5

# User Story 3.3.6
As a System User, I want to control a perspective camera using the mouse, so that I can freely explore the scene and inspect objects from different angles.

