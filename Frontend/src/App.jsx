import React, { useEffect, useState, createContext, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/App.css";

import GlobalLayout from "./components/GlobalLayout.jsx";
import LoginButton from "./components/LoginButton.jsx";

import Home from "./pages/Home.jsx";
import Visualisation from "./pages/Visualisation.jsx";
import Scheduling from "./pages/Scheduling.jsx";
import Schedule from "./pages/Schedule.jsx";
import AlternativeSchedule from "./pages/Alternative_Schedule.jsx";
import TestAlgorithms from "./pages/TestAlgorithms.jsx";
import UserManagement from "./pages/UserManagement.jsx";

import RejectVvnPage from "./pages/RejectVvnPage.jsx";
import ApproveVvnPage from "./pages/ApproveVvnPage.jsx";
import ListNotificationsPage from "./pages/ListNotificationsPage.jsx";
import AddVNNPage from "./pages/AddVVNPage.jsx";
import SubmitVvnPage from "./pages/SubmitVVNPage.jsx";

import DocksListPage from "./pages/DocksListPage.jsx";
import AvailableResourcesPage from "./pages/AvailableResourcesList.jsx";
import StorageAreasPage from "./pages/StorageAreasPage.jsx";

import VesselsListPage from "./pages/VesselsListPage.jsx";
import AddVesselPage from "./pages/AddVesselPage.jsx";


import VesselTypePage from "./pages/VesselTypesListPage.jsx";
import AddVesselTypePage from "./pages/AddVesselTypePage.jsx";


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
          role: "LogisticsOperator",   // CHANGE HERE THE ROLE 
          status: "Active"
        }; //roles: "Administrator","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"

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
            <DebugUserInfo /> {/* Mantenemos el debug en login para testing */}
          </div>
        }
      />

      {/* Protected Layout for ALL logged users */}
      <Route
        path="/"
        element={
          <ProtectedRoute
            requiredRoles={[
              "Administrator",
              "PortAuthorityOfficer",
              "ShippingAgentRepresentative",
              "LogisticsOperator"
            ]}
          >
            <GlobalLayout />
          </ProtectedRoute>
        }
      >   

        {/* ROUTES PROTECTED BY ROLE (3.1.3) */}

        <Route index element={<Home />} />

        <Route
          path="visualisation"
          element={
            <ProtectedRoute requiredRoles={["admin", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <Visualisation />
            </ProtectedRoute>
          }
        />

        <Route
          path="storage-areas/list"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <StorageAreasPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="resources/list"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <AvailableResourcesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="docks/list"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <DocksListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vessels/list"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <VesselsListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vessels/types/list"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <VesselTypePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vessels/new"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <AddVesselPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vessels/types/new"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <AddVesselTypePage />
            </ProtectedRoute>
          }
        />
        

        <Route
          path="/vvn/approve"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <ApproveVvnPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vvn/list"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <ListNotificationsPage/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vvn/reject"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <RejectVvnPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vvn/submit"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <SubmitVvnPage />
            </ProtectedRoute>
          }
        />
        

        <Route
          path="/vvn/add"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <AddVNNPage />
            </ProtectedRoute>
          }
        />
        

        <Route
          path="scheduling"
          element={
            <ProtectedRoute requiredRoles={["LogisticsOperator", "LogisticsOperator"]}>
              <Scheduling />
            </ProtectedRoute>
          }
            
        />

        <Route
          path="/alternative-schedule"
          element={
            <ProtectedRoute requiredRoles={["LogisticsOperator", "LogisticsOperator"]}>
              <AlternativeSchedule />
            </ProtectedRoute>
           }
        
        />
        <Route
          path="/test-algorithms"
          element={
          <ProtectedRoute requiredRoles={["LogisticsOperator", "LogisticsOperator"]}>
            <TestAlgorithms />
          </ProtectedRoute>
          } 
        
        />


        <Route
          path="schedule"
          element={
            <ProtectedRoute requiredRoles={["LogisticsOperator","LogisticsOperator"]}>
              <Schedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="user-management"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "LogisticsOperator"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div>Page not found</div>} />

      </Route>
    </Routes>
  );
};

export default App;