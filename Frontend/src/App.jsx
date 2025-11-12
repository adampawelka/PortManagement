import React from "react";
import GlobalLayout from "./components/GlobalLayout.jsx";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
//import PortVisualisation from "./components/PortVisualisation.jsx";
import Cube from "./components/Cube.tsx"
import { useAuth0 } from "@auth0/auth0-react";
import ThumbRaiserComponent from "./components/Thumb_Raiser.tsx"
import ThumbRaiserUI from "./components/Thumb_RaiserUI.tsx";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <GlobalLayout>
      <div className="container">
        <header>
          {/* Conditional render based on authentication */}
          {!isAuthenticated ? (
            <LoginButton />
          ) : (
            <div>
              <p>
                Hello, <strong>{user.name}</strong> ({user.email})
              </p>
              <LogoutButton />
            </div>
          )}
        </header>
        {/* Show the port visualisation under the welcome message when authenticated */}
        {isAuthenticated ? (
          <main>
            <h2>Welcome to Dock Manage System</h2>
            {/* <div style={{ maxWidth: 800, margin: "0 auto" }}>
               <Cube
                rotationSpeedX={0.02}
                rotationSpeedY={0.03}
                size={1.5}
                texture="assets/logo.png"
                fieldOfView={45}
                cameraZ={8}
              />
            </div>  */}
            <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
              {/* 3D game renders in the background */}
              <ThumbRaiserComponent />

              {/* UI overlays the canvas */}
              <ThumbRaiserUI />
            </div>

          </main>
        ) : (
          <div>
            <p>Please log in to access the port visualisation.</p>
          </div>
        )}
      </div>
    </GlobalLayout>
  );
}

export default App;
