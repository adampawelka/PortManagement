export const sidebarMenuItems = [
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
    name: "Vessel Visit Executions",
    key: "vve",
    path: "/vve",
    roles: ["LogisticsOperator"],
    subMenu: [
      {
        name: "List Executions",
        key: "vve_list",
        path: "/vve/list",
        roles: ["LogisticsOperator"],
      },
      {
        name: "Add Vessel Visit Execution",
        key: "add_vve",
        path: "/vve/add",
        roles: ["LogisticsOperator"],
      },
      {
        name: "Update Vessel Visit Execution",
        key: "update_vve",   
        path: "/vve/update",
        roles: ["LogisticsOperator"],
      },
      {
        name: "Search Vessel Visit Execution",
        key: "search_vve",   
        path: "/vve/search",
        roles: ["LogisticsOperator"],
      }
    ],
  },
  {
    name: "Incidents",
    key: "incidents", 
    path: "/incidents",
    roles: ["LogisticsOperator"],
    subMenu: [
      {
        name: "List Incidents",
        key: "incidents_list",
        path: "/incidents/list",
        roles: ["LogisticsOperator"],
      },
      {
        name: "Report Incident",
        key: "report_incident",
        path: "/incidents/report",
        roles: ["LogisticsOperator"],
      },
      {
        name: "Update Incident",
        key: "update_incident",
        path: "/incidents/update",
        roles: ["LogisticsOperator"],
      }
    ],
  },
  {
    name: "Incident Types",
    key: "incident_types",
    path: "/incident-types",
    roles: ["PortAuthorityOfficer"],
    subMenu: [
      {
        name: "Incident Types List",
        key: "incident_types_list",
        path: "/incident-types/list",
        roles: ["PortAuthorityOfficer"],
      },
      {
        name: "Add Incident Type",
        key: "add_incident_type",
        path: "/incident-types/add",
        roles: ["PortAuthorityOfficer"],
      },
      {
        name: "Edit Incident Type",
        key: "edit_incident_type",
        path: "/incident-types/edit",
        roles: ["PortAuthorityOfficer"],
      }
    ],
  },
  {
    name: "Complementary Tasks",
    key: "complementary_tasks",
    path: "/complementary-tasks",
    roles: ["LogisticsOperator"],
    subMenu: [
      {
        name: "Complementary Tasks List",
        key: "complementary_tasks_list",
        path: "/complementary-tasks/list",
        roles: ["LogisticsOperator"],
      },
      {
        name: "Log Complementary Task",
        key: "log_complementary_task",
        path: "/complementary-tasks/log",
        roles: ["LogisticsOperator"],
      },
      {
        name: "Update Complementary Task",
        key: "update_complementary_task",
        path: "/complementary-tasks/update",
        roles: ["LogisticsOperator"],
      }
    ],
  },
  {
    name: "Complementary Task Categories",
    key: "complementary_task_categories",
    path: "/complementary-task-categoies",
    roles: ["OperationsSupervisor"],
    subMenu: [
      {
        name: "Complementary Task Categories List",
        key: "complementary_task_categories_list",
        path: "/complementary-task-categories/list",
        roles: ["OperationsSupervisor"],
      },
      {
        name: "Add Complementary Task Category",
        key: "add_complementary_task_category",
        path: "/complementary-task-categories/add",
        roles: ["OperationsSupervisor"],
      },
      {
        name: "Edit Complementary Task Category",
        key: "edit_complementary_task_category",
        path: "/complementary-task-categories/edit",
        roles: ["OperationsSupervisor"],
      }
    ],
  },
  {
    name: "Operational Plans",
    key: "operational_plans",
    path: "/operational-plans",
    roles: ["LogisticsOperator"],
    subMenu:
      [
        {
          name: "Search Operational Plans",
          key: "search_operational_plans",
          path: "/operational-plans/search",
          roles: ["LogisticsOperator"],
        },
        {
          name: "Generate Operational Plans",
          key: "operational_plans_generate",
          path: "/operational-plans/generate",
          roles: ["LogisticsOperator"],
        },
        {
          name: "Missing Plans from VVNs",
          key: "operational_plans_missing",
          path: "/operational-plans/missing",
          roles: ["LogisticsOperator"],
        },
      ]
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
        name: "Genetic Schedule",
        key: "genetic_schedule",
        path: "/genetic-schedule",
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
  // TO-ADD VISUALISATION PERMS 
  {
    name: "Visualisation",
    key: "visualisation",
    path: "/visualisation",
    roles: ["admin", "user", "guest", "PortAuthorityOfficer", "ShippingAgentRepresentative", "LogisticsOperator"],
  },

]