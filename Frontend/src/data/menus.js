export const menuItems = [
  { 
    name: "Home", 
    path: "/" 
  },
  {
    name: "Vessel Visit Notifications",
    path: "/vvn",
    roles: ["admin", "user", "guest"],  // Accessible to everyone
    subMenu: [
      {
        name: "Pending Notifications",
        path: "/vvn/pending",
        roles: ["admin", "user", "guest"], // Accessible to everyone
      },
      {
        name: "Approved Notifications",
        path: "/vvn/approved",
        roles: ["admin", "user", "guest"], // Accessible to everyone
      },
      {
        name: "Rejected Notifications",
        path: "/vvn/rejected",
        roles: ["admin", "user", "guest"], // Accessible to everyone
      },
      {
        name: "Add New Notifications",
        path: "/vvn/add",
        roles: ["admin"], // Only admin can access
      },
    ],
  },
  {
    name: "Storage Areas",
    path: "/storage-areas",
    roles: ["admin", "user", "guest"],  // Accessible to everyone
    subMenu: [
      {
        name: "Storage Areas List",
        path: "/storage-areas/list",
        roles: ["admin", "user", "guest"], // Accessible to everyone
      },
      {
        name: "Add New Storage",
        path: "/storage-areas/add",
        roles: ["admin"], // Only admin can access
      },
    ],
  },
  {
    name: "Physical Resources",
    path: "/resources",
    roles: ["admin", "user", "guest"],  // Accessible to everyone
    subMenu: [
      {
        name: "Available Resources",
        path: "/resources/list",
        roles: ["admin", "user", "guest"], // Accessible to everyone
      },
      {
        name: "Allocate Resources",
        path: "/resources/allocate",
        roles: ["admin"], // Only admin can access
      },
    ],
  },
  {
    name: "Docks",
    path: "/docks",
    roles: ["admin", "user"],  // Accessible to everyone
    subMenu: [
      {
        name: "Dock List",
        path: "/docks/list",
        roles: ["admin", "user", "guest"], // Accessible to everyone
      },
      {
        name: "Add New Dock",
        path: "/docks/new",
        roles: ["admin"], // Only admin can access
      },
      {
        name: "Search",
        path: "/docks/search",
        roles: ["admin", "user", "guest"], // Accessible to everyone
      },
    ],
  },
  {
    name: "Vessels",
    path: "/vessels",
    roles: ["admin", "user", "guest"],  // Accessible to everyone
    subMenu: [
      {
        name: "Vessel List",
        path: "/vessels/list",
        roles: ["admin", "user", "guest"], // Accessible to everyone
      },
      {
        name: "Vessel New Vessel",
        path: "/vessels/new",
        roles: ["admin"], // Only admin can access
      },
      {
        name: "Search",
        path: "/vessels/search",
        roles: ["admin", "user", "guest"], // Accessible to everyone
      },
      {
        name: "Vessel Types",
        path: "/vessels/types",
        roles: ["admin", "user", "guest"], // Accessible to everyone
        subMenu: [
          {
            name: "Type List",
            path: "/vessels/types/list",
            roles: ["admin", "user", "guest"], // Accessible to everyone
          },
          {
            name: "Add New Type",
            path: "/vessels/types/new",
            roles: ["admin"], // Only admin can access
          },
          {
            name: "Search Type",
            path: "/vessels/types/search",
            roles: ["admin", "user"], // Admin and user can access
          },
        ],
      },
    ],
  }
];
