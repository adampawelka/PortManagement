// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import GlobalLayout from "./components/GlobalLayout.jsx";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";

import Home from "./pages/Home.jsx";
import Visualisation from "./pages/Visualisation.jsx";
import Scheduling from "./pages/Scheduling.jsx";
import Schedule from "./pages/Schedule.jsx"

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      {/* Public Login Page */}
      <Route
        path="/login"
        element={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              textAlign: "center",
            }}
          >
            <h1>Login</h1>
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
            <div className="App"> 
              <ThumbRaiser></ThumbRaiser>
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
};

export default App;