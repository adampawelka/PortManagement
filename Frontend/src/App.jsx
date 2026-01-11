import React, { useEffect, useState, createContext, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/App.css";
import PrivacyAcceptanceModal from './components/PrivacyAcceptanceModal';

import { ALL_ROLES } from "./data/roles.js"

import { protectedRoutes } from "./routes/protectedRoutes.jsx";

import GlobalLayout from "./components/GlobalLayout.jsx";
import LoginButton from "./components/LoginButton.jsx";
import AccountActivation from "./components/activate.jsx";

import { NotificationProvider } from './contexts/NotificationContext';
import NotificationToast from './components/NotificationSystem/NotificationToast';

import { useApi } from "./services/api.js";

export const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

// ---------------------------
// REAL API CALL (will be re-enabled later)
// ---------------------------
const fetchUserRole = async (iamUserId, name, email, apiFetch) => {
  const url = `/api/users/iam/${iamUserId}/role-status?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
  const res = await apiFetch(url);
  if (!res.ok) return null;
  return res.json(); // { role, status }
};

// ---------------------------
// PROTECTED ROUTE
// ---------------------------
const ProtectedRoute = ({ children, requiredRoles = [], testUser = null }) => {
  const { isAuthenticated, isLoading, user, logout } = useAuth0();
  const { apiFetch } = useApi();

  const [loadingUser, setLoadingUser] = useState(true);
  const [userData, setUserData] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [policy, setPolicy] = useState(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated) {
        setLoadingUser(false);
        return;
      }

      try {
        // TEMP DEVELOPMENT USER
        // const data1 = { role: "OperationsSupervisor", status: "Active" }; //for complementary Task Categories pages
        const data1 = { role: "LogisticsOperator", status: "Active" };

        // REAL API CALL
        // const data1 = testUser || await fetchUserRole(user.sub, user.name, user.email, apiFetch);

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
  }, [isAuthenticated, user?.sub, requiredRoles, apiFetch, testUser]);

  // Fetch privacy policy and verify acceptance for this user (client-side storage)
  useEffect(() => {
    const checkPolicyAcceptance = async () => {
      if (!isAuthenticated || !user?.sub) return;

      try {
        const res = await fetch('/privacyPolicy/json/1.0.json');
        if (!res.ok) return;
        const data = await res.json();
        setPolicy(data);

        const acceptedKey = `privacyAccepted:${user.sub}`;
        const acceptedVersion = localStorage.getItem(acceptedKey);

        if (!acceptedVersion || acceptedVersion !== data.version) {
          setShowPrivacyModal(true);
        } else {
          setShowPrivacyModal(false);
        }
      } catch (err) {
        console.error('Failed to load privacy policy for acceptance check:', err);
      }
    };

    checkPolicyAcceptance();
  }, [isAuthenticated, user?.sub]);

  if (isLoading || loadingUser) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

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
        )
        }
        <LoginButton />
      </div>
    );
  }

  const handleAcceptPolicy = () => {
    if (policy && user?.sub) {
      const acceptedKey = `privacyAccepted:${user.sub}`;
      localStorage.setItem(acceptedKey, policy.version);
    }
    setShowPrivacyModal(false);
  };

  const handleDeclinePolicy = () => {
    // Log out user if they decline
    logout({ returnTo: window.location.origin });
  };

  return (
    <UserContext.Provider value={userData}>
      {showPrivacyModal && (
        <PrivacyAcceptanceModal open={showPrivacyModal} policy={policy} onAccept={handleAcceptPolicy} onDecline={handleDeclinePolicy} />
      )}
      {!showPrivacyModal && children}
    </UserContext.Provider>
  );
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
    <div style={{ background: "#f8f8f8", padding: "10px", fontSize: "12px", marginTop: "10px", overflowX: "auto" }}>
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
    <NotificationProvider>
      <Routes>

      {/* Public Login Page */}
      <Route
        path="/login"
        element={
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <h1>Login</h1>
            <LoginButton />
            <DebugUserInfo />
          </div>
        }
      />

      <Route
        path="/activate"
        element={
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <h1>Activation</h1>
            <AccountActivation />
            <DebugUserInfo />
          </div>
        }
      />

      {/* Protected Layout for ALL logged users */}
      <Route
        path="/"
        element={
          <ProtectedRoute
            requiredRoles={ALL_ROLES}//{["Administrator", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator", "OperationsSupervisor"]}
          >
            <GlobalLayout />
          </ProtectedRoute>
        }
      >
        {Object.values(protectedRoutes).flat().map((r, idx) => (
          <Route
            key={idx}
            path={r.path}
            index={r.index}
            element={<ProtectedRoute requiredRoles={r.roles}>{r.element}</ProtectedRoute>}
          />
        ))}

        <Route path="*" element={<div>Page not found</div>} />
      </Route>


    </Routes>
    <NotificationToast />
    </NotificationProvider>
  );
};

export { ProtectedRoute };
export default App;
