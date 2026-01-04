"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannedOperationService = void 0;
const PlannedOperation_1 = require("../Domain/PlannedOperations/PlannedOperation");
const PlannedOperationId_1 = require("../Domain/PlannedOperations/PlannedOperationId");
const OperationPlanId_1 = require("../Domain/OperationPlans/OperationPlanId");
const PlannedResourceId_1 = require("../Domain/PlannedOperations/PlannedResourceId");
const PlannedStaffId_1 = require("../Domain/PlannedOperations/PlannedStaffId");
const PlannedStart_1 = require("../Domain/PlannedOperations/PlannedStart");
const PlannedEnd_1 = require("../Domain/PlannedOperations/PlannedEnd");
const OperationType_1 = require("../Domain/PlannedOperations/OperationType");
const PlannedOperationStatus_1 = require("../Domain/PlannedOperations/PlannedOperationStatus");
const VesselVisitExecutionId_1 = require("../Domain/VesselVisitExecutions/VesselVisitExecutionId");
const VvnId_1 = require("../Domain/VesselVisitExecutions/VvnId");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
class PlannedOperationService {
    constructor(plannedOperationRepo, operationPlanRepo, vveRepo) {
        this.plannedOperationRepo = plannedOperationRepo;
        this.operationPlanRepo = operationPlanRepo;
        this.vveRepo = vveRepo;
    }
    async create(dto) {
        const operationOrError = PlannedOperation_1.PlannedOperation.create({
            operationPlanId: OperationPlanId_1.OperationPlanId.create(new UniqueEntityID_1.UniqueEntityID(dto.operationPlanId)),
            resourceId: PlannedResourceId_1.PlannedResourceId.create(dto.resourceId).getValue(), // <-- add .getValue()
            staffId: PlannedStaffId_1.PlannedStaffId.create(dto.staffId).getValue(), // <-- add .getValue()
            plannedStart: PlannedStart_1.PlannedStart.create(new Date(dto.plannedStart)).getValue(),
            plannedEnd: PlannedEnd_1.PlannedEnd.create(new Date(dto.plannedEnd)).getValue(),
            operationType: OperationType_1.OperationType.create(dto.operationType).getValue(),
            status: PlannedOperationStatus_1.PlannedOperationStatus.create(PlannedOperationStatus_1.PlannedOperationStatusEnum.PLANNED).getValue()
        });
        if (operationOrError.isFailure) {
            throw new Error(operationOrError.errorValue().toString());
        }
        const operation = operationOrError.getValue();
        await this.plannedOperationRepo.save(operation);
        return this.toDTO(operation);
    }
    async getById(id) {
        const operationId = PlannedOperationId_1.PlannedOperationId.create(new UniqueEntityID_1.UniqueEntityID(id));
        const operation = await this.plannedOperationRepo.findById(operationId);
        if (!operation)
            return null;
        return this.toDTO(operation);
    }
    async getByOperationPlanId(operationPlanId) {
        const planId = OperationPlanId_1.OperationPlanId.create(new UniqueEntityID_1.UniqueEntityID(operationPlanId));
        const operations = await this.plannedOperationRepo.findByOperationPlanId(planId);
        return operations.map(op => this.toDTO(op));
    }
    async getAll() {
        const operations = await this.plannedOperationRepo.findAll();
        return operations.map(op => this.toDTO(op));
    }
    async getPlannedOperationsForVVE(vesselVisitExecutionId) {
        const vveId = VesselVisitExecutionId_1.VesselVisitExecutionId.create(new UniqueEntityID_1.UniqueEntityID(vesselVisitExecutionId));
        const vve = await this.vveRepo.findById(vveId);
        if (!vve) {
            throw new Error(`Vessel Visit Execution ${vesselVisitExecutionId} not found`);
        }
        // Get VVN from VVE and find operation plans by VVN
        const vvnId = vve.vvnId;
        const operationPlans = await this.operationPlanRepo.findAllByVvnId(vvnId);
        if (operationPlans.length === 0) {
            return [];
        }
        const allPlannedOps = [];
        for (const plan of operationPlans) {
            const planId = OperationPlanId_1.OperationPlanId.create(new UniqueEntityID_1.UniqueEntityID(plan.id.toString()));
            const plannedOps = await this.plannedOperationRepo.findByOperationPlanId(planId);
            allPlannedOps.push(...plannedOps);
        }
        return allPlannedOps.map(op => this.toDTO(op));
    }
    async update(id, dto) {
        const operationId = PlannedOperationId_1.PlannedOperationId.create(new UniqueEntityID_1.UniqueEntityID(id));
        const operation = await this.plannedOperationRepo.findById(operationId);
        if (!operation)
            return null;
        if (dto.plannedStart) {
            operation.props.plannedStart =
                PlannedStart_1.PlannedStart.create(new Date(dto.plannedStart)).getValue();
        }
        if (dto.plannedEnd) {
            operation.props.plannedEnd =
                PlannedEnd_1.PlannedEnd.create(new Date(dto.plannedEnd)).getValue();
        }
        if (dto.status) {
            operation.props.status =
                PlannedOperationStatus_1.PlannedOperationStatus.create(dto.status).getValue();
        }
        await this.plannedOperationRepo.save(operation);
        return this.toDTO(operation);
    }
    async getPlannedOperationsByVVN(vvnId) {
        // Directly find operation plans by VVN (no need to go through VVEs)
        const vvnIdVO = VvnId_1.VvnId.create(vvnId).getValue();
        const operationPlans = await this.operationPlanRepo.findAllByVvnId(vvnIdVO);
        if (operationPlans.length === 0) {
            return [];
        }
        const allPlannedOps = [];
        for (const plan of operationPlans) {
            const planId = OperationPlanId_1.OperationPlanId.create(new UniqueEntityID_1.UniqueEntityID(plan.id.toString()));
            const plannedOps = await this.plannedOperationRepo.findByOperationPlanId(planId);
            allPlannedOps.push(...plannedOps);
        }
        return allPlannedOps.map(op => this.toDTO(op));
    }
    toDTO(operation) {
        return {
            id: operation.id.toString(),
            operationPlanId: operation.operationPlanId.toString(),
            resourceId: operation.resourceId.toString(),
            staffId: operation.staffId.toString(),
            plannedStart: operation.plannedStart.value.toISOString(),
            plannedEnd: operation.plannedEnd.value.toISOString(),
            operationType: operation.operationType.value,
            status: operation.status.value
        };
    }
}
exports.PlannedOperationService = PlannedOperationService;
//# sourceMappingURL=PlannedOperationService.js.map