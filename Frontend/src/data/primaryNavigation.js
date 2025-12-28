export const primaryNavigationItems = [
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
        key: "approve_notifications",
        path: "/vvn/approve",
        roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
      },
      {
        name: "Reject Notifications",
        key: "reject_notifications",
        path: "/vvn/reject",
        roles: ["PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
      },
      {
        name: "Submit Notifications",
        key: "submit_notifications",
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
    name: "Staff Members",
    key: "staff_members",
    path: "/staff-members",
    roles: ["LogisticsOperator"],
    subMenu: [
      {
        name: "Manage Staff Members",
        key: "manage_staff_members",
        path: "/staff-members/manage",
        roles: ["LogisticsOperator"],
      },
      {
        name: "Add Staff Member",
        key: "add_staff_member",
        path: "/staff-members/add",
        roles: ["LogisticsOperator"],
      }
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
        roles: ["PortAuthorityOfficer", "LogisticsOperator", "admin", "guest"],
      },
      {
        name: "Add New Dock",
        key: "add_new_dock",
        path: "/docks/add",
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
        path: "/vessels/add",
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
            path: "/vessels/types/add",
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


