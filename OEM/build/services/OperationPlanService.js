"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationPlanService = void 0;
const axios_1 = __importDefault(require("axios"));
const OperationPlan_1 = require("../Domain/OperationPlans/OperationPlan");
const OperationPlanId_1 = require("../Domain/OperationPlans/OperationPlanId");
const VvnId_1 = require("../Domain/VesselVisitExecutions/VvnId");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const CreatedAt_1 = require("../Domain/OperationPlans/CreatedAt");
const CreatedBy_1 = require("../Domain/OperationPlans/CreatedBy");
const AlgorithmUsed_1 = require("../Domain/OperationPlans/AlgorithmUsed");
const ScheduledOperation_1 = require("../Domain/OperationPlans/ScheduledOperation");
class OperationPlanService {
    constructor(operationPlanRepo) {
        this.operationPlanRepo = operationPlanRepo;
    }
    mapScheduleDTOtoVO(scheduleDTO) {
        return scheduleDTO.map(dto => {
            const opOrError = ScheduledOperation_1.ScheduledOperation.create({
                vesselName: dto.vesselName,
                start: new Date(dto.start),
                end: new Date(dto.end),
                delay: dto.delay,
                dock: dto.dock,
                cranes: dto.cranes || [],
                staff: dto.staff || []
            });
            if (opOrError.isFailure)
                throw new Error(`Invalid ScheduledOperation: ${opOrError.errorValue()}`);
            return opOrError.getValue();
        });
    }
    async create(dto) {
        const planOrError = OperationPlan_1.OperationPlan.create({
            vvnId: VvnId_1.VvnId.create(dto.vvnId).getValue(),
            createdAt: CreatedAt_1.CreatedAt.create(dto.createdAt).getValue(),
            createdBy: CreatedBy_1.CreatedBy.create(dto.createdBy).getValue(),
            algorithmUsed: AlgorithmUsed_1.AlgorithmUsed.create(dto.algorithmUsed).getValue(),
            schedule: this.mapScheduleDTOtoVO(dto.schedule)
        }, new UniqueEntityID_1.UniqueEntityID());
        if (planOrError.isFailure)
            throw new Error(planOrError.errorValue().toString());
        const plan = planOrError.getValue();
        await this.operationPlanRepo.save(plan);
        return this.toDTO(plan);
    }
    async savePlans(plans, metadata) {
        const savedPlans = [];
        for (const planDto of plans) {
            if (!planDto.algorithmUsed && metadata.algorithmUsed) {
                planDto.algorithmUsed = metadata.algorithmUsed;
            }
            if (!planDto.createdBy && metadata.createdBy) {
                planDto.createdBy = metadata.createdBy;
            }
            if (!planDto.createdAt) {
                planDto.createdAt = new Date();
            }
            const planOrError = OperationPlan_1.OperationPlan.create({
                vvnId: VvnId_1.VvnId.create(planDto.vvnId).getValue(),
                createdAt: CreatedAt_1.CreatedAt.create(planDto.createdAt).getValue(),
                createdBy: CreatedBy_1.CreatedBy.create(planDto.createdBy).getValue(),
                algorithmUsed: AlgorithmUsed_1.AlgorithmUsed.create(planDto.algorithmUsed).getValue(),
                schedule: this.mapScheduleDTOtoVO(planDto.schedule)
            }, new UniqueEntityID_1.UniqueEntityID());
            if (planOrError.isFailure)
                throw new Error(planOrError.errorValue().toString());
            const plan = planOrError.getValue();
            await this.operationPlanRepo.save(plan);
            savedPlans.push(this.toDTO(plan));
        }
        return savedPlans;
    }
    async getById(id) {
        const plan = await this.operationPlanRepo.findById(OperationPlanId_1.OperationPlanId.create(new UniqueEntityID_1.UniqueEntityID(id)));
        return plan ? this.toDTO(plan) : null;
    }
    async getByVvnId(vvnId) {
        const plan = await this.operationPlanRepo.findByVvnId(VvnId_1.VvnId.create(vvnId).getValue());
        return plan ? this.toDTO(plan) : null;
    }
    async getAll() {
        const plans = await this.operationPlanRepo.findAll();
        return plans.map(this.toDTO);
    }
    async update(id, dto) {
        const plan = await this.operationPlanRepo.findById(OperationPlanId_1.OperationPlanId.create(new UniqueEntityID_1.UniqueEntityID(id)));
        if (!plan)
            return null;
        // Validate schedule if provided
        if (dto.schedule) {
            if (!Array.isArray(dto.schedule) || dto.schedule.length === 0) {
                throw new Error("Schedule must be a non-empty array of operations");
            }
            // Validate each operation in schedule
            for (let i = 0; i < dto.schedule.length; i++) {
                const op = dto.schedule[i];
                // Validate required fields
                if (!op.vesselName || op.vesselName.trim() === "") {
                    throw new Error(`Operation ${i + 1}: vesselName is required`);
                }
                if (!op.start) {
                    throw new Error(`Operation ${i + 1}: start time is required`);
                }
                if (!op.end) {
                    throw new Error(`Operation ${i + 1}: end time is required`);
                }
                if (op.delay === undefined || op.delay === null) {
                    throw new Error(`Operation ${i + 1}: delay is required`);
                }
                if (!op.dock || op.dock.trim() === "") {
                    throw new Error(`Operation ${i + 1}: dock is required`);
                }
                // Validate dates
                const startDate = new Date(op.start);
                const endDate = new Date(op.end);
                if (isNaN(startDate.getTime())) {
                    throw new Error(`Operation ${i + 1}: start time must be a valid date`);
                }
                if (isNaN(endDate.getTime())) {
                    throw new Error(`Operation ${i + 1}: end time must be a valid date`);
                }
                if (startDate >= endDate) {
                    throw new Error(`Operation ${i + 1}: start time must be before end time`);
                }
                // Validate delay
                if (op.delay < 0) {
                    throw new Error(`Operation ${i + 1}: delay cannot be negative`);
                }
                // Validate arrays
                if (op.cranes && !Array.isArray(op.cranes)) {
                    throw new Error(`Operation ${i + 1}: cranes must be an array`);
                }
                if (op.staff && !Array.isArray(op.staff)) {
                    throw new Error(`Operation ${i + 1}: staff must be an array`);
                }
            }
            // Check for inconsistencies before updating
            const warnings = [];
            const errors = [];
            // Get all other plans to check for conflicts
            const allPlans = await this.operationPlanRepo.findAll();
            const otherPlans = allPlans.filter(p => p.id.toString() !== id);
            // Check each operation in the new schedule
            for (let i = 0; i < dto.schedule.length; i++) {
                const newOp = dto.schedule[i];
                const newStart = new Date(newOp.start);
                const newEnd = new Date(newOp.end);
                const newCranes = newOp.cranes || [];
                const newStaff = newOp.staff || [];
                // Check for overlaps with other plans using same resources
                for (const otherPlan of otherPlans) {
                    for (const otherOp of otherPlan.schedule) {
                        const otherStart = otherOp.start;
                        const otherEnd = otherOp.end;
                        const otherCranes = otherOp.cranes || [];
                        const otherStaff = otherOp.staff || [];
                        // Check if time periods overlap
                        const timeOverlap = (newStart < otherEnd && newEnd > otherStart);
                        if (timeOverlap) {
                            // Check crane conflicts
                            const craneOverlap = newCranes.some(crane => otherCranes.includes(crane));
                            if (craneOverlap) {
                                const conflictingCranes = newCranes.filter(c => otherCranes.includes(c));
                                errors.push(`Operation ${i + 1}: Crane(s) ${conflictingCranes.join(', ')} already assigned to another plan (${otherPlan.vvnId.value}) during this time period`);
                            }
                            // Check staff conflicts
                            const staffOverlap = newStaff.some(staff => otherStaff.includes(staff));
                            if (staffOverlap) {
                                const conflictingStaff = newStaff.filter(s => otherStaff.includes(s));
                                warnings.push(`Operation ${i + 1}: Staff member(s) ${conflictingStaff.join(', ')} may be double-booked with another plan (${otherPlan.vvnId.value})`);
                            }
                        }
                    }
                }
                // Check if operation has at least one resource assigned
                if (newCranes.length === 0 && newStaff.length === 0) {
                    warnings.push(`Operation ${i + 1}: No cranes or staff assigned`);
                }
            }
            // Throw errors for critical conflicts
            if (errors.length > 0) {
                throw new Error(`Resource conflicts detected:\n${errors.join('\n')}`);
            }
            // Log warnings (non-blocking)
            if (warnings.length > 0) {
                console.warn('Operation Plan Update Warnings:', warnings);
            }
            plan.props.schedule = this.mapScheduleDTOtoVO(dto.schedule);
        }
        if (dto.createdAt)
            plan.props.createdAt = CreatedAt_1.CreatedAt.create(dto.createdAt).getValue();
        if (dto.createdBy)
            plan.props.createdBy = CreatedBy_1.CreatedBy.create(dto.createdBy).getValue();
        if (dto.algorithmUsed)
            plan.props.algorithmUsed = AlgorithmUsed_1.AlgorithmUsed.create(dto.algorithmUsed).getValue();
        await this.operationPlanRepo.save(plan);
        return this.toDTO(plan);
    }
    async search(dto) {
        const criteria = Object.assign({}, dto); // daty są już typu Date w DTO
        const plans = await this.operationPlanRepo.search(criteria);
        let results = plans.map(this.toDTO);
        if (dto.sortBy) {
            const sortOrder = dto.sortOrder === 'desc' ? -1 : 1;
            results.sort((a, b) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                let aValue, bValue;
                switch (dto.sortBy) {
                    case 'startTime':
                        aValue = (_b = (_a = a.schedule[0]) === null || _a === void 0 ? void 0 : _a.start.getTime()) !== null && _b !== void 0 ? _b : 0;
                        bValue = (_d = (_c = b.schedule[0]) === null || _c === void 0 ? void 0 : _c.start.getTime()) !== null && _d !== void 0 ? _d : 0;
                        break;
                    case 'vesselName':
                        aValue = (_f = (_e = a.schedule[0]) === null || _e === void 0 ? void 0 : _e.vesselName.toLowerCase()) !== null && _f !== void 0 ? _f : '';
                        bValue = (_h = (_g = b.schedule[0]) === null || _g === void 0 ? void 0 : _g.vesselName.toLowerCase()) !== null && _h !== void 0 ? _h : '';
                        break;
                    case 'delay':
                        aValue = Math.max(...a.schedule.map(s => s.delay), 0);
                        bValue = Math.max(...b.schedule.map(s => s.delay), 0);
                        break;
                    case 'createdAt':
                        aValue = a.createdAt.getTime();
                        bValue = b.createdAt.getTime();
                        break;
                    default:
                        return 0;
                }
                return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * sortOrder;
            });
        }
        return results;
    }
    async getMissingPlans(date) {
        try {
            // 1. Obtener todas las VVNs del sistema externo (Port Authority)
            // Ajusta la URL al puerto correcto de tu backend de .NET (generalmente 5000 o 5001)
            const response = await axios_1.default.get('http://localhost:5000/api/VesselVisitNotifications');
            const allVvns = response.data;
            // 2. Filtrar VVNs: 
            //    - Que estén 'Approved'
            //    - Que sean para la fecha solicitada (comparamos la parte de la fecha YYYY-MM-DD)
            const targetDate = new Date(date).toISOString().split('T')[0];
            const approvedVvnsForDate = allVvns.filter((vvn) => {
                const vvnDate = vvn.eta ? new Date(vvn.eta).toISOString().split('T')[0] : null;
                return vvn.status === 'Approved' && vvnDate === targetDate;
            });
            // 3. Obtener todos los planes que TÚ tienes en tu BD
            const existingPlans = await this.operationPlanRepo.findAll();
            // 4. Extraer los IDs de VVNs que ya tienen plan
            const plannedVvnIds = existingPlans.map(p => p.vvnId.toString());
            // 5. Encontrar los "Missing": VVNs aprobadas que NO están en tus planes
            const missingVvns = approvedVvnsForDate.filter((vvn) => !plannedVvnIds.includes(vvn.id));
            // 6. Mapear a DTO
            return missingVvns.map((vvn) => ({
                vvnId: vvn.id,
                vesselName: vvn.vesselName,
                eta: vvn.eta,
                status: vvn.status
            }));
        }
        catch (error) {
            console.error("Error in getMissingPlans:", error);
            throw new Error("Failed to fetch missing plans from Port Authority.");
        }
    }
    toDTO(plan) {
        return {
            id: plan.id.toString(),
            vvnId: plan.vvnId.value,
            createdAt: plan.createdAt.value,
            createdBy: plan.createdBy.value,
            algorithmUsed: plan.algorithmUsed.value,
            schedule: plan.schedule.map(op => ({
                vesselName: op.vesselName,
                start: op.start,
                end: op.end,
                delay: op.delay,
                dock: op.dock,
                cranes: op.cranes,
                staff: op.staff
            }))
        };
    }
    async getResourceAllocation(resourceType, resourceId, from, to) {
        const plans = await this.operationPlanRepo.findByOperationDateRange(from, to);
        let totalMinutes = 0;
        let operations = 0;
        for (const plan of plans) {
            for (const op of plan.schedule) {
                const usesResource = resourceType === 'CRANE' ? op.cranes.includes(resourceId) :
                    resourceType === 'STAFF' ? op.staff.includes(resourceId) :
                        op.dock === resourceId;
                if (!usesResource)
                    continue;
                const start = op.start < from ? from : op.start;
                const end = op.end > to ? to : op.end;
                if (start < end) {
                    totalMinutes += (end.getTime() - start.getTime()) / 60000;
                    operations++;
                }
            }
        }
        return {
            resourceType,
            resourceId,
            from,
            to,
            totalAllocatedMinutes: Math.round(totalMinutes),
            numberOfOperations: operations
        };
    }
}
exports.OperationPlanService = OperationPlanService;
//# sourceMappingURL=OperationPlanService.js.map