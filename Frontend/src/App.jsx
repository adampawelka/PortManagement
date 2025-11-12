// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import GlobalLayout from "./components/GlobalLayout.jsx";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";

import Home from "./pages/Home.jsx";
import Visualisation from "./pages/Visualisation.jsx";
import Scheduling from "./pages/Scheduling.jsx";
import Schedule from "./pages/Schedule.jsx";
import UserManagement from "./pages/UserManagement.jsx";

// ✅ Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ✅ Debug component to show token + user info
const DebugUserInfo = () => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          const t = await getAccessTokenSilently();
          setToken(t);
          console.log("🔐 Access Token:", t);
        } catch (err) {
          console.error("Failed to retrieve token:", err);
        }
      }
    };
    fetchToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (!isAuthenticated) return null;

  return (
    <div
      style={{
        background: "#f8f8f8",
        color: "#333",
        padding: "10px",
        fontSize: "12px",
        marginTop: "10px",
        overflowX: "auto",
      }}
    >
      <strong>User Info (debug view):</strong>
      <br />
      <ul>
        <li><strong>ID (sub):</strong> {user.sub}</li>
        <li><strong>Name:</strong> {user.name}</li>
        <li><strong>Email:</strong> {user.email}</li>
        {user.nickname && <li><strong>Nickname:</strong> {user.nickname}</li>}
      </ul>
      {process.env.NODE_ENV === "development" && (
        <>
          <strong>Access Token (debug view):</strong>
          <br />
          {token || "Fetching token..."}
        </>
      )}
    </div>
  );
};

// ✅ Main app
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

              {/* Logout button */}
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <LogoutButton />
              </div>

              {/* Debug: show user info */}
              <DebugUserInfo />
            </GlobalLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
