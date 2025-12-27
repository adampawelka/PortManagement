import React, { useEffect, useState, createContext, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/App.css";

import GlobalLayout from "./components/GlobalLayout.jsx";
import LoginButton from "./components/LoginButton.jsx";

import Home from "./pages/Home.jsx";

import Visualisation from "./pages/Visualisation.jsx";

import OptimalSchedule from "./pages/Scheduling/OptimalSchedule.jsx";
import AlternativeSchedule from "./pages/Scheduling/AlternativeSchedule.jsx";
import RecommendedSchedule from "./pages/Scheduling/RecommendedSchedule.jsx";
import TestAlgorithms from "./pages/Scheduling/TestAlgorithms.jsx";
import MultiCraneSchedule from "./pages/Scheduling/MultiCraneSchedule.jsx";

import UsersManagementPage from "./pages/Users/UsersManagement.jsx";
import PendingUsersManagementPage from "./pages/Users/PendingUsersManagementPage.jsx";

import RejectVVNPage from "./pages/VesselVisitNotifications/RejectVVNPage.jsx";
import ApproveVVNPage from "./pages/VesselVisitNotifications/ApproveVVNPage.jsx";
import ListNotificationsPage from "./pages/VesselVisitNotifications/ListNotificationsPage.jsx";
import AddVNNPage from "./pages/VesselVisitNotifications/AddVVNPage.jsx";
import SubmitVVNPage from "./pages/VesselVisitNotifications/SubmitVVNPage.jsx";

import AvailableResourcesPage from "./pages/Resources/AvailableResourcesList.jsx";
import AddResourcePage from "./pages/Resources/AddResourcesPage.jsx";

import StorageAreasPage from "./pages/StorageAreas/StorageAreasPage.jsx";
import AddStorageAreaPage from "./pages/StorageAreas/AddStorageArea.jsx";

import VesselsListPage from "./pages/Vessels/VesselsListPage.jsx";
import AddVesselPage from "./pages/Vessels/AddVesselPage.jsx";
import SearchVesselPage from "./pages/Vessels/SearchVesselPage.jsx";

import VesselTypePage from "./pages/Vessels/VesselTypesListPage.jsx";
import AddVesselTypePage from "./pages/Vessels/AddVesselTypePage.jsx";
import SearchVesselTypePage from "./pages/Vessels/SearchVesselTypePage.jsx";

import DocksListPage from "./pages/Docks/DocksListPage.jsx";
import AddDockPage from "./pages/Docks/AddDockPage.jsx";
import SearchDockPage from "./pages/Docks/SearchDockPage.jsx";

import OperationalPlansGenerate from "./pages/OperationalPlans/OperationalPlans.jsx";
import SearchOperationalPlans from "./pages/OperationalPlans/SearchOperationalPlans.jsx";


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
const ProtectedRoute = ({ children, requiredRoles = [] , testUser = null}) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const { apiFetch } = useApi();
  //const { apiOemFetch } = useApiOEM();

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
        //const data1 = testUser || await fetchUserRole(user.sub, user.name, user.email, apiFetch);
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
  }, [isAuthenticated, user?.sub, requiredRoles, apiFetch, testUser]);

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
          path="storage-areas/add"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <AddStorageAreaPage />
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
          path="resources/allocate"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <AddResourcePage />
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
          path="docks/add"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <AddDockPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="docks/search"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <SearchDockPage />
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
          path="/vessels/search"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <SearchVesselPage />
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
          path="/vessels/add"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <AddVesselPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vessels/types/add"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <AddVesselTypePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vessels/types/search"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <SearchVesselTypePage />
            </ProtectedRoute>
          }
        />
        

        <Route
          path="/vvn/approve"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <ApproveVVNPage />
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
              <RejectVVNPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vvn/submit"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"]}>
              <SubmitVVNPage />
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
          path="/operational-plans/generate"
          element={
            <ProtectedRoute requiredRoles={["LogisticsOperator", "LogisticsOperator"]}>
              <OperationalPlansGenerate />
            </ProtectedRoute>
           }
        />

        <Route
          path="operational-plans/search"
          element={
            <ProtectedRoute requiredRoles={["LogisticsOperator"]}>
              <SearchOperationalPlans />
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
          path="/optimal-schedule"
          element={
            <ProtectedRoute requiredRoles={["LogisticsOperator","LogisticsOperator"]}>
              <OptimalSchedule />
            </ProtectedRoute>
          }
        />

        <Route
            path="/multi-crane-schedule"
            element={
              <ProtectedRoute requiredRoles={["LogisticsOperator","LogisticsOperator"]}>
                <MultiCraneSchedule />
              </ProtectedRoute>
          }
        />

        <Route
          path="/recommended-schedule"
          element={
            <ProtectedRoute requiredRoles={["LogisticsOperator","LogisticsOperator"]}>
              <RecommendedSchedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="user-management/users"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "LogisticsOperator"]}>
              <UsersManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="user-management/pending-users"
          element={
            <ProtectedRoute requiredRoles={["Administrator", "LogisticsOperator"]}>
              <PendingUsersManagementPage />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<div>Page not found</div>} />

      </Route>
    </Routes>
  );
};

export { ProtectedRoute }; // for testing
export default App;