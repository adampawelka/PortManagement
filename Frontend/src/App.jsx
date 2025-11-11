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
import UserManagement from "./pages/UserManagement.jsx";

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
          </div>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <GlobalLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/visualisation" element={<Visualisation />} />
                <Route path="/scheduling" element={<Scheduling />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <LogoutButton />
              </div>
            </GlobalLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;