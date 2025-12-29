import Home from "../pages/Home.jsx";
import Visualisation from "../pages/Visualisation.jsx";

// Storage Areas
import StorageAreasPage from "../pages/StorageAreas/StorageAreasPage.jsx";
import AddStorageAreaPage from "../pages/StorageAreas/AddStorageArea.jsx";

// Resources
import AvailableResourcesPage from "../pages/Resources/AvailableResourcesList.jsx";
import AddResourcePage from "../pages/Resources/AddResourcesPage.jsx";

// Staff Members
import ManageStaffMembersPage from "../pages/StaffMembers/ManageStaffMembersPage.jsx";
import AddStaffMemberPage from "../pages/StaffMembers/AddStaffMemberPage.jsx";

// Qualifications
import QualificationsListPage from "../pages/Qualifications/QualificationsListPage.jsx";
import AddQualificationPage from "../pages/Qualifications/AddQualificationPage.jsx";
import UpdateQualificationPage from "../pages/Qualifications/UpdateQualificationPage.jsx";

// Docks
import DocksListPage from "../pages/Docks/DocksListPage.jsx";
import AddDockPage from "../pages/Docks/AddDockPage.jsx";
import SearchDockPage from "../pages/Docks/SearchDockPage.jsx";

// Vessels
import VesselsListPage from "../pages/Vessels/VesselsListPage.jsx";
import AddVesselPage from "../pages/Vessels/AddVesselPage.jsx";
import SearchVesselPage from "../pages/Vessels/SearchVesselPage.jsx";
import VesselTypePage from "../pages/Vessels/VesselTypesListPage.jsx";
import AddVesselTypePage from "../pages/Vessels/AddVesselTypePage.jsx";
import SearchVesselTypePage from "../pages/Vessels/SearchVesselTypePage.jsx";

// VVN
import ApproveVVNPage from "../pages/VesselVisitNotifications/ApproveVVNPage.jsx";
import RejectVVNPage from "../pages/VesselVisitNotifications/RejectVVNPage.jsx";
import ListNotificationsPage from "../pages/VesselVisitNotifications/ListNotificationsPage.jsx";
import AddVNNPage from "../pages/VesselVisitNotifications/AddVVNPage.jsx";
import SubmitVVNPage from "../pages/VesselVisitNotifications/SubmitVVNPage.jsx";

//VVE
import VVEListPage from "../pages/VesselVisitExecutions/VVEListPage.jsx";
import UpdateVVEProgressPage from "../pages/VesselVisitExecutions/UpdateVVEProgressPage.jsx";

// Operational Plans
import OperationalPlansGenerate from "../pages/OperationalPlans/GenerateOperationalPlans.jsx";
import SearchOperationalPlans from "../pages/OperationalPlans/SearchOperationalPlans.jsx";

// Scheduling
import OptimalSchedule from "../pages/Scheduling/OptimalSchedule.jsx";
import AlternativeSchedule from "../pages/Scheduling/AlternativeSchedule.jsx";
import RecommendedSchedule from "../pages/Scheduling/RecommendedSchedule.jsx";
import TestAlgorithms from "../pages/Scheduling/TestAlgorithms.jsx";
import MultiCraneSchedule from "../pages/Scheduling/MultiCraneSchedule.jsx";

// User Management
import UsersManagementPage from "../pages/Users/UsersManagement.jsx";
import PendingUsersManagementPage from "../pages/Users/PendingUsersManagementPage.jsx";

// ---------------------------
// Grouped Routes
// ---------------------------
export const protectedRoutes = {
  home: [
    { path: "/", element: <Home />, roles: ["Administrator","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"], index: true },
    { path: "visualisation", element: <Visualisation />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] }
  ],

  storageAreas: [
    { path: "storage-areas/list", element: <StorageAreasPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "storage-areas/add", element: <AddStorageAreaPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] }
  ],

  resources: [
    { path: "resources/list", element: <AvailableResourcesPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "resources/allocate", element: <AddResourcePage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] }
  ],

  staffMembers: [
    { path: "staff-members/manage", element: <ManageStaffMembersPage />, roles: ["Administrator","LogisticsOperator"] },
    { path: "staff-members/add", element: <AddStaffMemberPage />, roles: ["Administrator","LogisticsOperator"] }
  ],

  qualifications: [
    { path: "qualifications/list", element: <QualificationsListPage />, roles: ["Administrator","LogisticsOperator"] },
    { path: "qualifications/add", element: <AddQualificationPage />, roles: ["Administrator","LogisticsOperator"] },
    { path: "qualifications/update", element: <UpdateQualificationPage />, roles: ["Administrator","LogisticsOperator"] }
  ],

  docks: [
    { path: "docks/list", element: <DocksListPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "docks/add", element: <AddDockPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "docks/search", element: <SearchDockPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] }
  ],

  vessels: [
    { path: "/vessels/list", element: <VesselsListPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "/vessels/search", element: <SearchVesselPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "/vessels/types/list", element: <VesselTypePage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "/vessels/add", element: <AddVesselPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "/vessels/types/add", element: <AddVesselTypePage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "/vessels/types/search", element: <SearchVesselTypePage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] }
  ],

  vvn: [
    { path: "/vvn/approve", element: <ApproveVVNPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "/vvn/list", element: <ListNotificationsPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "/vvn/reject", element: <RejectVVNPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "/vvn/submit", element: <SubmitVVNPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] },
    { path: "/vvn/add", element: <AddVNNPage />, roles: ["Administrator","user","PortAuthorityOfficer","ShippingAgentRepresentative","LogisticsOperator"] }
  ],

  vve: [
    { path: "/vve/list", element: <VVEListPage />, roles: ["LogisticsOperator"] },
    { path: "/vve/update", element: <UpdateVVEProgressPage />, roles: ["LogisticsOperator"] }
  ],

  operationalPlans: [
    { path: "/operational-plans/generate", element: <OperationalPlansGenerate />, roles: ["LogisticsOperator"] },
    { path: "operational-plans/search", element: <SearchOperationalPlans />, roles: ["LogisticsOperator"] }
  ],

  scheduling: [
    { path: "/optimal-schedule", element: <OptimalSchedule />, roles: ["LogisticsOperator"] },
    { path: "/alternative-schedule", element: <AlternativeSchedule />, roles: ["LogisticsOperator"] },
    { path: "/recommended-schedule", element: <RecommendedSchedule />, roles: ["LogisticsOperator"] },
    { path: "/test-algorithms", element: <TestAlgorithms />, roles: ["LogisticsOperator"] },
    { path: "/multi-crane-schedule", element: <MultiCraneSchedule />, roles: ["LogisticsOperator"] }
  ],

  userManagement: [
    { path: "user-management/users", element: <UsersManagementPage />, roles: ["Administrator","LogisticsOperator"] },
    { path: "user-management/pending-users", element: <PendingUsersManagementPage />, roles: ["Administrator","LogisticsOperator"] }
  ]
};
