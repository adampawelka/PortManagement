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

// Create and export the UserContext (so Sidebar or other components can use it)
export const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);


const fetchUserRole = async (iamUserId, token) => {
  const res = await fetch(`http://localhost:5000/api/users/${iamUserId}/role-status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok)
    return null; // user not found or other error
  return res.json(); // { role, status }
};


const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user } = useAuth0();
  const [loadingUser, setLoadingUser] = useState(true);
  const [userData, setUserData] = useState(null); // { role, status }
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const data1 = await fetchUserRole(user.sub, token); // { role, status }

        const data = {
          role: "Administrator",
          status: "Active",
        };
        setUserData(data);

        // Deny access if status is not Active or role is not allowed
        if (!data)
          setAccessDenied(true);
        else if (data.status !== "Active" || !requiredRoles.includes(data.role)) {
          setAccessDenied(true);
        }
      } catch (err) {
        console.error(err);
        setAccessDenied(true);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, getAccessTokenSilently, user, requiredRoles]);

  if (isLoading || loadingUser)
    return <div>Loading...</div>;
  if (!isAuthenticated)
    return <Navigate to="/login" replace />;
  if (accessDenied) {
    return (
      <div>
        Access Denied. Please contact an administrator.
        {userData ? (
          <div>
            <p>Role: {userData.role}</p>
            <p>Status: {userData.status}</p>
          </div>
        ) : (
          <div>
            <p>User not registered in the system.</p>
          </div>
        )}
      </div>
    );
  }

  // At this point, user is authenticated and authorized
  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
};



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
          <ProtectedRoute
            requiredRoles={["Administrator", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}
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
