"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutedOperationService = void 0;
const ExecutedOperation_1 = require("../Domain/ExecutedOperations/ExecutedOperation");
const ExecutedOperationId_1 = require("../Domain/ExecutedOperations/ExecutedOperationId");
const VesselVisitExecutionId_1 = require("../Domain/VesselVisitExecutions/VesselVisitExecutionId");
const ResourceId_1 = require("../Domain/ExecutedOperations/ResourceId");
const StaffId_1 = require("../Domain/ExecutedOperations/StaffId");
const ActualStart_1 = require("../Domain/ExecutedOperations/ActualStart");
const ActualEnd_1 = require("../Domain/ExecutedOperations/ActualEnd");
const ExecutedOperationStatus_1 = require("../Domain/ExecutedOperations/ExecutedOperationStatus");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
class ExecutedOperationService {
    constructor(operationRepo, plannedOpService, vveRepo) {
        this.operationRepo = operationRepo;
        this.plannedOpService = plannedOpService;
        this.vveRepo = vveRepo;
    }
    async create(dto) {
        const statusEnum = this.parseStatus(dto.status);
        const resourceId = ResourceId_1.ResourceId.create(dto.resourceId).getValue();
        const staffId = StaffId_1.StaffId.create(dto.staffId).getValue();
        const vesselVisitExecutionId = dto.vesselVisitExecutionId; // string UUID
        const plannedOperationId = dto.plannedOperationId; // string UUID
        const operationOrError = ExecutedOperation_1.ExecutedOperation.create({
            vesselVisitExecutionId,
            plannedOperationId,
            resourceId,
            staffId,
            actualStart: ActualStart_1.ActualStart.create(new Date(dto.actualStart)).getValue(),
            actualEnd: dto.actualEnd ? ActualEnd_1.ActualEnd.create(new Date(dto.actualEnd)).getValue() : undefined,
            status: ExecutedOperationStatus_1.ExecutedOperationStatus.create(statusEnum).getValue()
        });
        if (operationOrError.isFailure) {
            throw new Error(operationOrError.errorValue().toString());
        }
        const operation = operationOrError.getValue();
        await this.operationRepo.save(operation);
        return this.toDTO(operation);
    }
    async createFromPlannedOperation(dto) {
        // Validate that the planned operation exists
        const plannedOp = await this.plannedOpService.getById(dto.plannedOperationId);
        if (!plannedOp) {
            throw new Error(`Planned Operation ${dto.plannedOperationId} not found`);
        }
        // Validate that the VVE exists and is in progress
        const vveId = VesselVisitExecutionId_1.VesselVisitExecutionId.caller(new UniqueEntityID_1.UniqueEntityID(dto.vesselVisitExecutionId));
        const vve = await this.vveRepo.findById(vveId);
        if (!vve) {
            throw new Error(`Vessel Visit Execution ${dto.vesselVisitExecutionId} not found`);
        }
        if (vve.status.value !== 'IN_PROGRESS') {
            throw new Error(`Vessel Visit Execution is not in progress. Current status: ${vve.status.value}`);
        }
        // Create the executed operation
        const executedOp = await this.create(dto);
        return executedOp;
    }
    async batchCreateFromPlannedOperations(vveId, plannedOperationIds) {
        const vve = VesselVisitExecutionId_1.VesselVisitExecutionId.caller(new UniqueEntityID_1.UniqueEntityID(vveId));
        const vveEntity = await this.vveRepo.findById(vve);
        if (!vveEntity) {
            throw new Error(`Vessel Visit Execution ${vveId} not found`);
        }
        if (vveEntity.status.value !== 'IN_PROGRESS') {
            throw new Error(`Vessel Visit Execution is not in progress. Current status: ${vveEntity.status.value}`);
        }
        const results = [];
        for (const plannedOpId of plannedOperationIds) {
            // Get planned operation details
            const plannedOp = await this.plannedOpService.getById(plannedOpId);
            // Create executed operation from planned operation
            const executedOpDTO = {
                vesselVisitExecutionId: vveId,
                plannedOperationId: plannedOpId,
                resourceId: plannedOp.resourceId,
                staffId: plannedOp.staffId,
                actualStart: new Date().toISOString(), // Start now
                actualEnd: undefined, // Not ended yet
                status: 'started' // Mark as started
            };
            const created = await this.create(executedOpDTO);
            results.push(created);
        }
        return results;
    }
    async getById(id) {
        const operationId = ExecutedOperationId_1.ExecutedOperationId.create(new UniqueEntityID_1.UniqueEntityID(id));
        const operation = await this.operationRepo.findById(operationId);
        return operation ? this.toDTO(operation) : null;
    }
    async getByVesselVisitExecutionId(vveId) {
        const operations = await this.operationRepo.findByVesselVisitExecutionId(vveId);
        return operations.map(op => this.toDTO(op));
    }
    async getAll() {
        const operations = await this.operationRepo.findAll();
        return operations.map(op => this.toDTO(op));
    }
    async getAvailablePlannedOperationsForVVE(vesselVisitExecutionId) {
        const vveId = VesselVisitExecutionId_1.VesselVisitExecutionId.caller(new UniqueEntityID_1.UniqueEntityID(vesselVisitExecutionId));
        const vve = await this.vveRepo.findById(vveId);
        if (!vve) {
            throw new Error(`Vessel Visit Execution ${vesselVisitExecutionId} not found`);
        }
        if (vve.status.value !== 'IN_PROGRESS') {
            throw new Error(`Vessel Visit Execution is not in progress. Current status: ${vve.status.value}`);
        }
        return await this.plannedOpService.getPlannedOperationsForVVE(vesselVisitExecutionId);
    }
    async update(id, dto) {
        const operationId = ExecutedOperationId_1.ExecutedOperationId.create(new UniqueEntityID_1.UniqueEntityID(id));
        const operation = await this.operationRepo.findById(operationId);
        if (!operation)
            return null;
        if (dto.actualStart) {
            operation.updateActualStart(ActualStart_1.ActualStart.create(new Date(dto.actualStart)).getValue());
        }
        if (dto.actualEnd) {
            operation.updateActualEnd(ActualEnd_1.ActualEnd.create(new Date(dto.actualEnd)).getValue());
        }
        if (dto.status) {
            const statusEnum = this.parseStatus(dto.status);
            operation.updateStatus(ExecutedOperationStatus_1.ExecutedOperationStatus.create(statusEnum).getValue());
        }
        await this.operationRepo.save(operation);
        return this.toDTO(operation);
    }
    parseStatus(value) {
        if (!Object.values(ExecutedOperationStatus_1.ExecutedOperationStatusEnum).includes(value)) {
            throw new Error(`Invalid ExecutedOperationStatus: ${value}`);
        }
        return value;
    }
    toDTO(operation) {
        return {
            id: operation.id.toString(),
            vesselVisitExecutionId: operation.vesselVisitExecutionId,
            plannedOperationId: operation.plannedOperationId,
            resourceId: operation.resourceId.value,
            staffId: operation.staffId.value,
            actualStart: operation.actualStart.value.toISOString(),
            actualEnd: operation.actualEnd ? operation.actualEnd.value.toISOString() : undefined,
            status: operation.status.value
        };
    }
}
exports.ExecutedOperationService = ExecutedOperationService;
//# sourceMappingURL=ExecutedOperationService.js.map