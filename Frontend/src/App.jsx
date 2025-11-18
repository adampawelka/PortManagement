import React, { useEffect, useState, createContext, useContext } from "react";
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

import { useApi } from "./services/api.js";

export const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

// ---------------------------
// REAL API CALL (will be re-enabled later)
// ---------------------------
const fetchUserRole = async (iamUserId, apiFetch) => {
  const res = await apiFetch(`/api/users/${iamUserId}/role-status`);
  if (!res.ok) return null;
  return res.json(); // { role, status }
};

// ---------------------------
// PROTECTED ROUTE
// ---------------------------
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const { apiFetch } = useApi();

  const [loadingUser, setLoadingUser] = useState(true);
  const [userData, setUserData] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated) {
        setLoadingUser(false);
        return;
      }

      try {
        // ----------------------------------------
        // TEMPORARY DEVELOPMENT USER
        // ----------------------------------------
        const data1 = {
          role: "LogisticsOperator",   // CHANGE HERE THE ROLE (Administrator, LogisticsOperator...)
          status: "Active"
        };

        // ----------------------------------------
        // REAL API CALL — use this when BD works:
        // const data1 = await fetchUserRole(user.sub, apiFetch);
        // ----------------------------------------

        setUserData(data1);

        if (!data1 || data1.status !== "Active" || !requiredRoles.includes(data1.role)) {
          setAccessDenied(true);
        }
      } catch (err) {
        console.error("Error fetching role:", err);
        setAccessDenied(true);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, user?.sub, requiredRoles, apiFetch]);

  if (isLoading || loadingUser)
    return <div>Loading...</div>;

  if (!isAuthenticated)
    return <Navigate to="/login" replace />;

  if (accessDenied) {
    return (
      <div>
        <h2>Access Denied</h2>
        {userData ? (
          <>
            <p>Role: {userData.role}</p>
            <p>Status: {userData.status}</p>
          </>
        ) : (
          <p>User not registered in system.</p>
        )}
      </div>
    );
  }

  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
};

// ---------------------------
// DEBUG INFO
// ---------------------------
const DebugUserInfo = () => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          const t = await getAccessTokenSilently();
          setToken(t);
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
        padding: "10px",
        fontSize: "12px",
        marginTop: "10px",
        overflowX: "auto",
      }}
    >
      <strong>User Info (debug view):</strong>
      <ul>
        <li><strong>ID (sub):</strong> {user.sub}</li>
        <li><strong>Name:</strong> {user.name}</li>
        <li><strong>Email:</strong> {user.email}</li>
      </ul>

      <strong>Access Token:</strong>
      <br />
      {token || "Fetching token..."}
    </div>
  );
};

// ---------------------------
// MAIN APP
// ---------------------------
const App = () => {
  return (
    <Routes>

      {/* Public Login Page */}
      <Route
        path="/login"
        element={
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}>
            <h1>Login</h1>
            <LoginButton />
          </div>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute
            requiredRoles={[
              "Administrator",
              "PortAuthorityOfficer",
              "ShippingAgentRepresentative",
              "LogisticsOperator"
            ]}
          >
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

              <DebugUserInfo />
            </GlobalLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
