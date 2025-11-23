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
        name: "Pending Notifications",
        key: "pending_notifications",
        path: "/vvn/pending",
        roles: ["PortAuthorityOfficer", "LogisticsOperator"],
      },
      {
        name: "Approved Notifications",
        key: "approved_notifications",
        path: "/vvn/approved",
        roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
      },
      {
        name: "Rejected Notifications",
        key: "rejected_notifications",
        path: "/vvn/rejected",
        roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
      },
      {
        name: "Add New Notification",
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
        path: "/vessels/types",
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
            name: "Schedule",
            key: "schedule",
            path: "/schedule",
            roles: ["LogisticsOperator"],
          },
          {
            name: "Alternative Schedule",
            key: "alternative_schedule",
            path: "/alternative-schedule",
            roles: ["LogisticsOperator"],
          },
          
    ]
  },
  {
  name: "User Management",
  key: "user_management",
  path: "/user-management",
  roles: ["Administrator", "LogisticsOperator"],
  },
];
