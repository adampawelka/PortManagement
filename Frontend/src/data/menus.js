export const menuItems = [
  { 
    name: "Home", 
    key: "home",
    path: "/",
    roles: null
  },
  {
    name: "Vessel Visit Notifications",
    key: "vessel_visit_notifications",
    path: "/vvn",
    roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
    subMenu: [
      {
        name: "List Notifications",
        key: "list_notifications",
        path: "/vvn/list",
        roles: ["PortAuthorityOfficer", "LogisticsOperator"],
      },
      {
        name: "Approve Notifications",
        key: "approved_notifications",
        path: "/vvn/approve",
        roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
      },
      {
        name: "Reject Notifications",
        key: "rejected_notifications",
        path: "/vvn/reject",
        roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
      },
      {
        name: "Submit Notifications",
        key: "submitted_notifications",
        path: "/vvn/submit",
        roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
      },
      {
        name: "Add Notification",
        key: "add_new_notification",
        path: "/vvn/add",
        roles: ["PortAuthorityOfficer", "LogisticsOperator"],
      },
    ],
  },
  {
    name: "Storage Areas",
    key: "storage_areas",
    path: "/storage-areas",
    roles: ["LogisticsOperator"],
    subMenu: [
      {
        name: "Storage Areas List",
        key: "storage_areas",
        path: "/storage-areas/list",
        roles: ["LogisticsOperator"],
      },
      {
        name: "Add New Storage",
        key: "add_new_storage",
        path: "/storage-areas/add",
        roles: ["LogisticsOperator"],
      },
    ],
  },
  {
    name: "Physical Resources",
    key: "available_resources",
    path: "/resources",
    roles: ["LogisticsOperator"],
    subMenu: [
      {
        name: "Available Resources",
        key: "available_resources",
        path: "/resources/list",
        roles: ["LogisticsOperator"],
      },
      {
        name: "Allocate Resources",
        key: "allocate_resources",
        path: "/resources/allocate",
        roles: ["LogisticsOperator"],
      },
    ],
  },
  {
    name: "Docks",
    key: "docks",
    path: "/docks",
    roles: ["PortAuthorityOfficer", "LogisticsOperator", "admin"],
    subMenu: [
      {
        name: "Dock List",
        key: "dock_list",
        path: "/docks/list",
        roles: ["PortAuthorityOfficer", "LogisticsOperator","admin", "guest"],
      },
      {
        name: "Add New Dock",
        key: "add_new_dock",
        path: "/docks/new",
        roles: ["PortAuthorityOfficer", "LogisticsOperator"],
      },
      {
        name: "Search",
        key: "search",
        path: "/docks/search",
        roles: ["PortAuthorityOfficer", "LogisticsOperator", "admin"],
      },
    ],
  },
  {
    name: "Vessels",
    key: "vessels",
    path: "/vessels",
    roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
    subMenu: [
      {
        name: "Vessel List",
        key: "vessel_list",
        path: "/vessels/list",
        roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
      },
      {
        name: "Add New Vessel",
        key: "add_new_vessel",
        path: "/vessels/new",
        roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
      },
      {
        name: "Search",
        key: "search",
        path: "/vessels/search",
        roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
      },
      {
        name: "Vessel Types",
        key: "vessel_types",
        //path: "/vessels/types",
        roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
        subMenu: [
          {
            name: "Type List",
            key: "type_list",
            path: "/vessels/types/list",
            roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
          },
          {
            name: "Add New Type",
            key: "add_new_type",
            path: "/vessels/types/new",
            roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
          },
          {
            name: "Search Type",
            key: "search_type",
            path: "/vessels/types/search",
            roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
          },
        ],
      },
    ],
  },
  // TO-ADD VISUALISATION PERMS 
  {
    name: "Visualisation",
    key: "visualisation",
    path: "/visualisation",
    roles: ["admin", "user", "guest", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
  },
  {
    name: "Scheduling",
    key: "scheduling",
    path: "/scheduling",
    roles: ["LogisticsOperator"],
    subMenu: [
          {
            name: "Recommended Schedule",
            key: "recommended_schedule",
            path: "/recommended-schedule",
            roles: ["LogisticsOperator"],
          },
          {
            name: "Optimal Schedule",
            key: "optimal_schedule",
            path: "/optimal-schedule",
            roles: ["LogisticsOperator"],
          },
          {
            name: "Alternative Schedule",
            key: "alternative_schedule",
            path: "/alternative-schedule",
            roles: ["LogisticsOperator"],
          },
          {
            name: "Schedule Multi Crane",
            key: "schedule_multi_crane",
            path: "/schedule-multi-crane",
            roles: ["LogisticsOperator"],
          },
          {
            name: "Test Algorithms",
            key: "test_algorithms",
            path: "/test-algorithms",
            roles: ["admin", "user", "guest"],
          },
          
    ]
  },
  {
  name: "User Management",
  key: "user_management",
  path: "/user-management",
  roles: ["Administrator", "LogisticsOperator"],
  subMenu: 
    [
      {
        name: "Users",
        key: "users",
        path: "/user-management/users",
        roles: ["Administrator", "LogisticsOperator"],
      },
      {
        name: "Pending Users",
        key: "pending_users",
        path: "/user-management/pending-users",
        roles: ["Administrator", "LogisticsOperator"],
      }
    ]
  },
];
