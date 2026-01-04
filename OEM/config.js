import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("Couldn't find .env file");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000, 

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  }, // change this. is an example

  /**
   * BackendAPI URL for inter-module communication
   */
  backendApiUrl: process.env.BACKEND_API_URL || "http://localhost:5000/api",

  controllers: {
    complementaryTaskCategory: {
      name: "ComplementaryTaskCategoryController",
      path: "../controllers/IControllers/ComplementaryTaskCategoryController"
    },
    complementaryTask: {
      name: "ComplementaryTaskController",
      path: "../controllers/IControllers/ComplementaryTaskController"
    },
    vesselVisitExecution: {
      name: "VesselVisitExecutionController",
      path: "../controllers/IControllers/VesselVisitExecutionController"
    },
    plannedOperation: {
      name: "PlannedOperationController",
      path: "../controllers/IControllers/PlannedOperationController"
    },
    operationPlan: {
      name: "OperationPlanController",
      path: "../controllers/IControllers/OperationPlanController"
    },
    incidentType: {
      name: "IncidentTypeController",
      path: "../controllers/IControllers/IncidentTypeController"
    },
    incident: {
      name: "IncidentController",
      path: "../controllers/IControllers/IncidentController"
    },
    executedOperation: {
      name: "ExecutedOperationController",
      path: "../controllers/IControllers/ExecutedOperationController"
    }
  },

  repos: {
    complementaryTaskCategory: {
      name: "ComplementaryTaskCategoryRepo",
      path: "../repos/ComplementaryTaskCategoryRepo"
    },
    complementaryTask: {
      name: "ComplementaryTaskRepo",
      path: "../repos/ComplementaryTaskRepo"
    },
    vesselVisitExecution: {
      name: "VesselVisitExecutionRepo",
      path: "../repos/VesselVisitExecutionRepo"
    },
    plannedOperation: {
      name: "PlannedOperationRepo",
      path: "../repos/PlannedOperationRepo"
    },
    operationPlan: {
      name: "OperationPlanRepo",
      path: "../repos/OperationPlanRepo"
    },
    incidentType: {
      name: "IncidentTypeRepo",
      path: "../repos/IncidentTypeRepo"
    },
    incident: {
      name: "IncidentRepo",
      path: "../repos/IncidentRepo"
    },
    executedOperation: {
      name: "ExecutedOperationRepo",
      path: "../repos/ExecutedOperationRepo"
    }
  },

  services: {
    complementaryTaskCategory: {
      name: "ComplementaryTaskCategoryService",
      path: "../services/ComplementaryTaskCategoryService"
    },
    complementaryTask: {
      name: "ComplementaryTaskService",
      path: "../services/ComplementaryTaskService"
    },
    vesselVisitExecution: {
      name: "VesselVisitExecutionService",
      path: "../services/VesselVisitExecutionService"
    },
    plannedOperation: {
      name: "PlannedOperationService",
      path: "../services/PlannedOperationService"
    },
    operationPlan: {
      name: "OperationPlanService",
      path: "../services/OperationPlanService"
    },
    incidentType: {
      name: "IncidentTypeService",
      path: "../services/IncidentTypeService"
    },
    incident: {
      name: "IncidentService",
      path: "../services/IncidentService"
    },
    executedOperation: {
      name: "ExecutedOperationService",
      path: "../services/ExecutedOperationService"
    }
  }
};
