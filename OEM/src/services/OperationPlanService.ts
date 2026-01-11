import { IOperationPlanService } from "./IServices/IOperationPlanService";
import { IOperationPlanRepo } from "./IRepos/IOperationPlanRepo";
import {
  OperationPlanDTO,
  CreateOperationPlanDTO,
  UpdateOperationPlanDTO,
  ScheduledOperationDTO,
  SearchOperationPlanDTO,
  MissingPlanDTO
} from "../dto/OperationPlanDTO";

import axios from 'axios';

import { ResourceAllocationDTO } from "../dto/OperationPlanDTO";
import { OperationPlan } from "../Domain/OperationPlans/OperationPlan";
import { OperationPlanId } from "../Domain/OperationPlans/OperationPlanId";
import { VvnId } from "../Domain/VesselVisitExecutions/VvnId";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { CreatedAt } from "../Domain/OperationPlans/CreatedAt";
import { CreatedBy } from "../Domain/OperationPlans/CreatedBy";
import { AlgorithmUsed } from "../Domain/OperationPlans/AlgorithmUsed";
import { ScheduledOperation } from "../Domain/OperationPlans/ScheduledOperation";

export class OperationPlanService implements IOperationPlanService {
  constructor(private readonly operationPlanRepo: IOperationPlanRepo) { }

  private mapScheduleDTOtoVO(scheduleDTO: ScheduledOperationDTO[]): ScheduledOperation[] {
    return scheduleDTO.map(dto => {
      const opOrError = ScheduledOperation.create({
        vesselName: dto.vesselName,
        start: new Date(dto.start),
        end: new Date(dto.end),
        delay: dto.delay,
        dock: dto.dock,
        cranes: dto.cranes || [],
        staff: dto.staff || []
      });
      if (opOrError.isFailure) throw new Error(`Invalid ScheduledOperation: ${opOrError.errorValue()}`);
      return opOrError.getValue();
    });
  }

  async create(dto: CreateOperationPlanDTO): Promise<OperationPlanDTO> {
    const planOrError = OperationPlan.create({
      vvnId: VvnId.create(dto.vvnId).getValue(),
      createdAt: CreatedAt.create(dto.createdAt).getValue(),
      createdBy: CreatedBy.create(dto.createdBy).getValue(),
      algorithmUsed: AlgorithmUsed.create(dto.algorithmUsed).getValue(),
      schedule: this.mapScheduleDTOtoVO(dto.schedule)
    }, new UniqueEntityID());

    if (planOrError.isFailure) throw new Error(planOrError.errorValue().toString());

    const plan = planOrError.getValue();
    await this.operationPlanRepo.save(plan);
    return this.toDTO(plan);
  }


  async savePlans(plans: CreateOperationPlanDTO[], metadata: { algorithmUsed: string; createdBy: string }): Promise<OperationPlanDTO[]> {
    const savedPlans: OperationPlanDTO[] = [];

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

      const planOrError = OperationPlan.create({
        vvnId: VvnId.create(planDto.vvnId).getValue(),
        createdAt: CreatedAt.create(planDto.createdAt).getValue(),
        createdBy: CreatedBy.create(planDto.createdBy).getValue(),
        algorithmUsed: AlgorithmUsed.create(planDto.algorithmUsed).getValue(),
        schedule: this.mapScheduleDTOtoVO(planDto.schedule)
      }, new UniqueEntityID());

      if (planOrError.isFailure) throw new Error(planOrError.errorValue().toString());

      const plan = planOrError.getValue();
      await this.operationPlanRepo.save(plan);
      savedPlans.push(this.toDTO(plan));
    }

    return savedPlans;
  }

  async getById(id: string): Promise<OperationPlanDTO | null> {
    const plan = await this.operationPlanRepo.findById(OperationPlanId.create(new UniqueEntityID(id)));
    return plan ? this.toDTO(plan) : null;
  }

  async getByVvnId(vvnId: string): Promise<OperationPlanDTO | null> {
    const plan = await this.operationPlanRepo.findByVvnId(VvnId.create(vvnId).getValue());
    return plan ? this.toDTO(plan) : null;
  }

  async getAll(): Promise<OperationPlanDTO[]> {
    const plans = await this.operationPlanRepo.findAll();
    return plans.map(this.toDTO);
  }

  async update(id: string, dto: UpdateOperationPlanDTO): Promise<OperationPlanDTO | null> {
    const plan = await this.operationPlanRepo.findById(OperationPlanId.create(new UniqueEntityID(id)));
    if (!plan) return null;

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
      const warnings: string[] = [];
      const errors: string[] = [];

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
                errors.push(
                  `Operation ${i + 1}: Crane(s) ${conflictingCranes.join(', ')} already assigned to another plan (${otherPlan.vvnId.value}) during this time period`
                );
              }

              // Check staff conflicts
              const staffOverlap = newStaff.some(staff => otherStaff.includes(staff));
              if (staffOverlap) {
                const conflictingStaff = newStaff.filter(s => otherStaff.includes(s));
                warnings.push(
                  `Operation ${i + 1}: Staff member(s) ${conflictingStaff.join(', ')} may be double-booked with another plan (${otherPlan.vvnId.value})`
                );
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

    if (dto.createdAt) plan.props.createdAt = CreatedAt.create(dto.createdAt).getValue();
    if (dto.createdBy) plan.props.createdBy = CreatedBy.create(dto.createdBy).getValue();
    if (dto.algorithmUsed) plan.props.algorithmUsed = AlgorithmUsed.create(dto.algorithmUsed).getValue();

    await this.operationPlanRepo.save(plan);
    return this.toDTO(plan);
  }

  async search(dto: SearchOperationPlanDTO): Promise<OperationPlanDTO[]> {
    const criteria: any = { ...dto }; // daty są już typu Date w DTO
    const plans = await this.operationPlanRepo.search(criteria);
    let results = plans.map(this.toDTO);

    if (dto.sortBy) {
      const sortOrder = dto.sortOrder === 'desc' ? -1 : 1;
      results.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (dto.sortBy) {
          case 'startTime':
            aValue = a.schedule[0]?.start.getTime() ?? 0;
            bValue = b.schedule[0]?.start.getTime() ?? 0;
            break;
          case 'vesselName':
            aValue = a.schedule[0]?.vesselName.toLowerCase() ?? '';
            bValue = b.schedule[0]?.vesselName.toLowerCase() ?? '';
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

  public async getMissingPlans(date: string, token?: string): Promise<MissingPlanDTO[]> {
    try {
      // 1. Pobieramy dane z systemu zewnętrznego (.NET Port Authority)
      // Przekazujemy token, aby przejść przez [Authorize] w .NET
      const response = await axios.get('http://localhost:5000/api/VesselVisitNotifications', {
        headers: {
          'Authorization': token || ''
        }
      });

      const allVvns = response.data;

      // 2. Przygotowujemy datę do porównania (format YYYY-MM-DD)
      const targetDate = new Date(date).toISOString().split('T')[0];

      // 3. Pobieramy istniejące plany z Twojej bazy (Node.js)
      const existingPlans = await this.operationPlanRepo.findAll();

      // 4. Wyciągamy ID wizyt, które JUŻ MAJĄ plany
      // Ponieważ vvnId to Value Object (z pola OperationPlanProps), 
      // musimy sięgnąć do .value lub użyć toString() jeśli jest tak zdefiniowany
      const plannedVvnIds = existingPlans.map(p => {
        // Próba pobrania wartości z obiektu domenowego VvnId
        const idValue = p.vvnId && typeof p.vvnId === 'object' ? (p.vvnId as any).value : p.vvnId;
        return idValue?.toString().toLowerCase().trim();
      }).filter(id => id !== undefined && id !== null);

      // 5. Filtrujemy dane z .NET, zostawiając tylko te, których BRAKUJE
      const missingVvns = allVvns.filter((vvn: any) => {
        // Sprawdzamy status i datę
        const vvnDate = vvn.eta ? new Date(vvn.eta).toISOString().split('T')[0] : null;
        const isApproved = vvn.status === 'Approved';
        const isTargetDate = vvnDate === targetDate;

        // Sprawdzamy, czy ten ID z .NET już istnieje w naszych planach
        const externalId = vvn.id?.toString().toLowerCase().trim();
        const alreadyHasPlan = plannedVvnIds.includes(externalId);

        // Warunek: Zatwierdzone + Dobra data + BRAK istniejącego planu
        return isApproved && isTargetDate && !alreadyHasPlan;
      });

      // 6. Mapujemy wynik na format DTO dla frontendu
      return missingVvns.map((vvn: any) => ({
        vvnId: vvn.id,
        vesselName: vvn.vesselName,
        eta: vvn.eta,
        status: vvn.status
      }));

    } catch (error: any) {
      console.error("Error in getMissingPlans Service:", error.message);

      // Obsługa specyficznych błędów API
      if (error.response?.status === 401) {
        throw new Error("Port Authority: Unauthorized access. Please log in again.");
      }

      throw new Error("Could not fetch or filter missing plans from Port Authority.");
    }
  }

  private toDTO(plan: OperationPlan): OperationPlanDTO {
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

  async getResourceAllocation(
    resourceType: 'CRANE' | 'STAFF' | 'DOCK',
    resourceId: string,
    from: Date,
    to: Date
  ): Promise<ResourceAllocationDTO> {
    const plans = await this.operationPlanRepo.findByOperationDateRange(from, to);

    let totalMinutes = 0;
    let operations = 0;

    for (const plan of plans) {
      for (const op of plan.schedule) {

        const usesResource =
          resourceType === 'CRANE' ? op.cranes.includes(resourceId) :
            resourceType === 'STAFF' ? op.staff.includes(resourceId) :
              op.dock === resourceId;

        if (!usesResource) continue;

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
