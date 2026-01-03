import { ALL_ROLES } from "../data/roles.js"

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
import UpdateVVEPage from "../pages/VesselVisitExecutions/UpdateVVEPage.jsx";
import AddVVEPage from "../pages/VesselVisitExecutions/AddVVEPage.jsx";

// Operational Plans
import OperationalPlansGenerate from "../pages/OperationalPlans/GenerateOperationalPlans.jsx";
import SearchOperationalPlans from "../pages/OperationalPlans/SearchOperationalPlans.jsx";
import MissingOperationalPlans from "../pages/OperationalPlans/MissingOperationalPlans.jsx";

// Incident 

// Incident Types
import IncidentTypesListPage from "../pages/IncidentTypes/IncidentTypesListPage.jsx";
import AddIncidentTypePage from "../pages/IncidentTypes/AddIncidentTypePage.jsx";
import EditIncidentTypePage from "../pages/IncidentTypes/EditIncidentTypePage.jsx";

// Complementary Tasks


// Complementary Task Categories
import ComplementaryTaskCategoriesList from "../pages/ComplementaryTaskCategories/ComplementaryTaskCategoriesListPage.jsx"
import AddComplementaryTaskCategory from "../pages/ComplementaryTaskCategories/AddComplementaryTaskCategoryPage.jsx"
import EditComplementaryTaskCategory from "../pages/ComplementaryTaskCategories/EditComplementaryTaskCategoryPage.jsx"

// Scheduling
import OptimalSchedule from "../pages/Scheduling/OptimalSchedule.jsx";
import AlternativeSchedule from "../pages/Scheduling/AlternativeSchedule.jsx";
import RecommendedSchedule from "../pages/Scheduling/RecommendedSchedule.jsx";
import TestAlgorithms from "../pages/Scheduling/TestAlgorithms.jsx";
import MultiCraneSchedule from "../pages/Scheduling/MultiCraneSchedule.jsx";
import GeneticSchedule from "../pages/Scheduling/GeneticSchedule.jsx";

// User Management
import UsersManagementPage from "../pages/Users/UsersManagement.jsx";
import PendingUsersManagementPage from "../pages/Users/PendingUsersManagementPage.jsx";

import ThumbRaiserComponent from "../pages/Visualisation.jsx";

import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";

// ---------------------------
// Grouped Routes
// ---------------------------
export const protectedRoutes = {
  home: [
    { path: "/", element: <Home />, roles: ALL_ROLES, index: true },
  ],

  privacyPolicy: [
    {
      path: "/privacy-policy", element: <PrivacyPolicy />, roles: ALL_ROLES
    },
  ],

  storageAreas: [
    { path: "storage-areas/list", element: <StorageAreasPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "storage-areas/add", element: <AddStorageAreaPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] }
  ],

  resources: [
    { path: "resources/list", element: <AvailableResourcesPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "resources/allocate", element: <AddResourcePage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] }
  ],

  staffMembers: [
    { path: "staff-members/manage", element: <ManageStaffMembersPage />, roles: ["Administrator", "LogisticsOperator"] },
    { path: "staff-members/add", element: <AddStaffMemberPage />, roles: ["Administrator", "LogisticsOperator"] }
  ],

  qualifications: [
    { path: "qualifications/list", element: <QualificationsListPage />, roles: ["Administrator", "LogisticsOperator"] },
    { path: "qualifications/add", element: <AddQualificationPage />, roles: ["Administrator", "LogisticsOperator"] },
    { path: "qualifications/update", element: <UpdateQualificationPage />, roles: ["Administrator", "LogisticsOperator"] }
  ],

  docks: [
    { path: "docks/list", element: <DocksListPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "docks/add", element: <AddDockPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "docks/search", element: <SearchDockPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] }
  ],

  vessels: [
    { path: "/vessels/list", element: <VesselsListPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "/vessels/search", element: <SearchVesselPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "/vessels/types/list", element: <VesselTypePage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "/vessels/add", element: <AddVesselPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "/vessels/types/add", element: <AddVesselTypePage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "/vessels/types/search", element: <SearchVesselTypePage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] }
  ],

  vvn: [
    { path: "/vvn/approve", element: <ApproveVVNPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "/vvn/list", element: <ListNotificationsPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "/vvn/reject", element: <RejectVVNPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "/vvn/submit", element: <SubmitVVNPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] },
    { path: "/vvn/add", element: <AddVNNPage />, roles: ["Administrator", "user", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"] }
  ],

  vve: [
    { path: "/vve/list", element: <VVEListPage />, roles: ["LogisticsOperator"] },
    { path: "/vve/add", element: <AddVVEPage />, roles: ["LogisticsOperator"] },
    { path: "/vve/update", element: <UpdateVVEPage />, roles: ["LogisticsOperator"] },          // without ID
    { path: "/vve/:vveId/update", element: <UpdateVVEPage />, roles: ["LogisticsOperator"] }   // with ID -> reditect from VVE list
  ],


  operationalPlans: [
    { path: "/operational-plans/generate", element: <OperationalPlansGenerate />, roles: ["LogisticsOperator"] },
    { path: "operational-plans/search", element: <SearchOperationalPlans />, roles: ["LogisticsOperator"] },
    { path: "operational-plans/missing", element: <MissingOperationalPlans />, roles: ["LogisticsOperator"] }
  ],

  incidentTypes: [
    { path: "/incident-types/list", element: <IncidentTypesListPage />, roles: ["PortAuthorityOfficer"] },
    { path: "/incident-types/add", element: <AddIncidentTypePage />, roles: ["PortAuthorityOfficer"] },
    { path: "/incident-types/edit", element: <EditIncidentTypePage />, roles: ["PortAuthorityOfficer"] },
    //{ path: "/incident-types/:id/edit", element: <EditIncidentTypePage />, roles: ["PortAuthorityOfficer"] }
  ],

  complementaryTaskCategories: [
    { path: "/complementary-task-categories/list", element: <ComplementaryTaskCategoriesList />, roles: ["OperationsSupervisor"] },
    { path: "/complementary-task-categories/add", element: <AddComplementaryTaskCategory />, roles: ["OperationsSupervisor"] },
    { path: "/complementary-task-categories/edit", element: <EditComplementaryTaskCategory />, roles: ["OperationsSupervisor"] },

  ],

  scheduling: [
    { path: "/optimal-schedule", element: <OptimalSchedule />, roles: ["LogisticsOperator"] },
    { path: "/alternative-schedule", element: <AlternativeSchedule />, roles: ["LogisticsOperator"] },
    { path: "/recommended-schedule", element: <RecommendedSchedule />, roles: ["LogisticsOperator"] },
    { path: "/test-algorithms", element: <TestAlgorithms />, roles: ["LogisticsOperator"] },
    { path: "/multi-crane-schedule", element: <MultiCraneSchedule />, roles: ["LogisticsOperator"] },
    { path: "/genetic-schedule", element: <GeneticSchedule />, roles: ["LogisticsOperator"] }
  ],

  userManagement: [
    { path: "user-management/users", element: <UsersManagementPage />, roles: ["Administrator", "LogisticsOperator"] },
    { path: "user-management/pending-users", element: <PendingUsersManagementPage />, roles: ["Administrator", "LogisticsOperator"] }
  ],

  visualisation: [
    {
      path: "/visualisation", element: <ThumbRaiserComponent />, roles: ["LogisticsOperator"]

    }
  ],
};
