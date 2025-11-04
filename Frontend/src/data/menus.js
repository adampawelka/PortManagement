export const menuItems = [
    { name: "Home", path: "/" },
    {
        name: "Vessel Visit Notifications",
        path: "/vvn",
        subMenu: [
            { name: "Pending Notifications", path: "/vvn/pending" },
            { name: "Approved Notifications", path: "/vvn/approved" },
            { name: "Rejected Notifications", path: "/vvn/rejected" },
            { name: "Add New Notifications", path: "/vvn/add" },
            //{ name: "Search", path: "/vessels/search" },
        ],
    },
    {
        name: "Storage Areas",
        path: "/storage-areas",
        subMenu: [
            { name: "Storage Areas List", path: "/storage-areas/list" },
            { name: "Add New Storage", path: "/storage-areas/add" },
        ],
    },
    {
        name: "Physical Resources",
        path: "/resources",
        subMenu: [
            { name: "Available Resources", path: "/resources/list" },
            { name: "Allocate Resources", path: "/resources/allocate" },
        ],
    },
    {
        name: "Docks",
        path: "/docks",
        subMenu: [
            { name: "Dock List", path: "/docks/list" },
            { name: "Add New Dock", path: "/docks/new" },
            { name: "Search", path: "/docks/search" },

        ],
    },
    {
        name: "Vessels",
        path: "/vessels",
        subMenu: [
            { name: "Vessel List", path: "/vessels/list" },
            { name: "Vessel New Dock", path: "/vessels/new" },
            { name: "Search", path: "/vessels/search" },
            {
                name: "Vessel Types",
                path: "/vessels/types",
                subMenu: [
                    { name: "Type List", path: "/vessels/types/list" },
                    { name: "Add New Type", path: "/vessels/types/new" },
                    { name: "Search Type", path: "/vessels/types/search" },
                ],
            },
        ],
    }

];
