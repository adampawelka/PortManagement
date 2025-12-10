export const sidebarMenuItems = [{
    name: "Operational Plans",
    key: "operational_plans",
    path: "/operational-plans",
    roles: ["LogisticsOperator"],
    subMenu:
      [
        {
          name: "Operational Plans List",
          key: "operational_plans_list",
          path: "/operational-plans/list",
          roles: ["LogisticsOperator"],
        },
        {
          name: "Generate Operational Plans",
          key: "operational_plans_generate",
          path: "/operational-plans/generate",
          roles: ["LogisticsOperator"],
        },
      ]
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
        key: "multi_crane_schedule",
        path: "/multi-crane-schedule",
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
]