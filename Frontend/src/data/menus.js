export const menuItems = [
  { 
    name: "Home", 
    key: "home",
    path: "/" 
  },
  {
    name: "Vessel Visit Notifications",
    key: "vessel_visit_notifications",
    path: "/vvn",
    roles: ["admin", "user", "guest"],
    subMenu: [
      {
        name: "Pending Notifications",
        key: "pending_notifications",
        path: "/vvn/pending",
        roles: ["admin", "user", "guest"],
      },
      {
        name: "Approved Notifications",
        key: "approved_notifications",
        path: "/vvn/approved",
        roles: ["admin", "user", "guest"],
      },
      {
        name: "Rejected Notifications",
        key: "rejected_notifications",
        path: "/vvn/rejected",
        roles: ["admin", "user", "guest"],
      },
      {
        name: "Add New Notification",
        key: "add_new_notification",
        path: "/vvn/add",
        roles: ["admin"],
      },
    ],
  },
  {
    name: "Storage Areas",
    key: "storage_areas",
    path: "/storage-areas",
    roles: ["admin", "user", "guest"],
    subMenu: [
      {
        name: "Storage Areas List",
        key: "storage_areas",
        path: "/storage-areas/list",
        roles: ["admin", "user", "guest"],
      },
      {
        name: "Add New Storage",
        key: "add_new_storage",
        path: "/storage-areas/add",
        roles: ["admin"],
      },
    ],
  },
  {
    name: "Physical Resources",
    key: "available_resources",
    path: "/resources",
    roles: ["admin", "user", "guest"],
    subMenu: [
      {
        name: "Available Resources",
        key: "available_resources",
        path: "/resources/list",
        roles: ["admin", "user", "guest"],
      },
      {
        name: "Allocate Resources",
        key: "allocate_resources",
        path: "/resources/allocate",
        roles: ["admin"],
      },
    ],
  },
  {
    name: "Docks",
    key: "docks",
    path: "/docks",
    roles: ["admin"],
    subMenu: [
      {
        name: "Dock List",
        key: "dock_list",
        path: "/docks/list",
        roles: ["admin, guest"],
      },
      {
        name: "Add New Dock",
        key: "add_new_dock",
        path: "/docks/new",
        roles: ["admin"],
      },
      {
        name: "Search",
        key: "search",
        path: "/docks/search",
        roles: ["admin"],
      },
    ],
  },
  {
    name: "Vessels",
    key: "vessels",
    path: "/vessels",
    roles: ["admin", "user", "guest"],
    subMenu: [
      {
        name: "Vessel List",
        key: "vessel_list",
        path: "/vessels/list",
        roles: ["admin", "user", "guest"],
      },
      {
        name: "Add New Vessel",
        key: "add_new_vessel",
        path: "/vessels/new",
        roles: ["admin"],
      },
      {
        name: "Search",
        key: "search",
        path: "/vessels/search",
        roles: ["admin", "user", "guest"],
      },
      {
        name: "Vessel Types",
        key: "vessel_types",
        path: "/vessels/types",
        roles: ["admin", "user", "guest"],
        subMenu: [
          {
            name: "Type List",
            key: "type_list",
            path: "/vessels/types/list",
            roles: ["admin", "user", "guest"],
          },
          {
            name: "Add New Type",
            key: "add_new_type",
            path: "/vessels/types/new",
            roles: ["admin"],
          },
          {
            name: "Search Type",
            key: "search_type",
            path: "/vessels/types/search",
            roles: ["admin", "user"],
          },
        ],
      },
    ],
  },
  {
    name: "Visualisation",
    key: "visualisation",
    path: "/visualisation",
    roles: ["admin", "user"],
  },
  {
    name: "Scheduling",
    key: "scheduling",
    path: "/scheduling",
    roles: ["admin", "user"],
    subMenu: [
          {
            name: "Schedule",
            key: "schedule",
            path: "/schedule",
            roles: ["admin", "user", "guest"],
          },
          {
            name: "Alternative Schedule",
            key: "alternative_schedule",
            path: "/alternative-schedule",
            roles: ["admin", "user", "guest"],
          },
          
    ]
  },
];
