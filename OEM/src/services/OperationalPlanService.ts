import { Service, Inject } from 'typedi';
import config from "../../config";
import axios from 'axios';

import { IOperationPlanService } from "./IServices/IOperationPlanService";
import { IOperationPlanRepo } from "./IRepos/IOperationPlanRepo";
import { IVesselVisitExecutionRepo } from "./IRepos/IVesselVisitExecutionRepo";

import {
  OperationPlanDTO,
  CreateOperationPlanDTO,
  UpdateOperationPlanDTO,
  MissingPlanVvnDTO
} from "../dto/OperationPlanDTO";

import { OperationPlan } from "../Domain/OperationPlans/OperationPlan";
import { OperationPlanId } from "../Domain/OperationPlans/OperationPlanId";
import { VesselVisitExecutionId } from "../Domain/VesselVisitExecutions/VesselVisitExecutionId";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { CreatedAt } from "../Domain/OperationPlans/CreatedAt";
import { CreatedBy } from "../Domain/OperationPlans/CreatedBy";
import { AlgorithmUsed } from "../Domain/OperationPlans/AlgorithmUsed";

@Service()
export class OperationPlanService implements IOperationPlanService {

  constructor(
    @Inject(config.repos.operationPlan.name) private readonly operationPlanRepo: IOperationPlanRepo,
    @Inject(config.repos.vesselVisitExecution.name) private readonly vveRepo: IVesselVisitExecutionRepo
  ) {}

  async create(
    dto: CreateOperationPlanDTO
  ): Promise<OperationPlanDTO> {

    const planOrError = OperationPlan.create({
      vesselVisitExecutionId: VesselVisitExecutionId.create(
        new UniqueEntityID(dto.vesselVisitExecutionId)
      ),
      createdAt: CreatedAt.create(
        new Date(dto.createdAt)
      ).getValue(),
      createdBy: CreatedBy.create(dto.createdBy).getValue(),
      algorithmUsed: AlgorithmUsed.create(dto.algorithmUsed).getValue()
    });

    if (planOrError.isFailure) {
      throw new Error(planOrError.errorValue().toString());
    }

    const plan = planOrError.getValue();
    await this.operationPlanRepo.save(plan);

    return this.toDTO(plan);
  }

  async getById(
    id: string
  ): Promise<OperationPlanDTO | null> {

    const planId = OperationPlanId.create(
      new UniqueEntityID(id)
    );

    const plan = await this.operationPlanRepo.findById(planId);
    if (!plan) return null;

    return this.toDTO(plan);
  }

  async getByvesselVisitExecutionId(
    vesselVisitExecutionId: string
  ): Promise<OperationPlanDTO | null> {

    const vve = VesselVisitExecutionId.create(
      new UniqueEntityID(vesselVisitExecutionId)
    );

    const plan = await this.operationPlanRepo.findByvesselVisitExecutionId(vve);
    if (!plan) return null;

    return this.toDTO(plan);
  }

  async getAll(): Promise<OperationPlanDTO[]> {
    const plans = await this.operationPlanRepo.findAll();
    return plans.map(p => this.toDTO(p));
  }

  async update(
    id: string,
    dto: UpdateOperationPlanDTO
  ): Promise<OperationPlanDTO | null> {

    const planId = OperationPlanId.create(
      new UniqueEntityID(id)
    );

    const plan = await this.operationPlanRepo.findById(planId);
    if (!plan) return null;

    if (dto.createdAt) {
      plan.props.createdAt =
        CreatedAt.create(new Date(dto.createdAt)).getValue();
    }

    if (dto.createdBy) {
      plan.props.createdBy =
        CreatedBy.create(dto.createdBy).getValue();
    }

    if (dto.algorithmUsed) {
      plan.props.algorithmUsed =
        AlgorithmUsed.create(dto.algorithmUsed).getValue();
    }

    await this.operationPlanRepo.save(plan);
    return this.toDTO(plan);
  }

  // --- IMPLEMENTACIÓN DE TAREA 4.1.5 ---
  public async getMissingPlans(): Promise<MissingPlanVvnDTO[]> {
    try {
      // 1. Fetch de VVNs externas (Port Authority)
      // Ajusta la URL según tu entorno real
      const response = await axios.get('http://localhost:5000/api/VesselVisitNotifications');
      const allVvns = response.data;

      // 2. Filtrar aprobadas
      const approvedVvns = allVvns.filter((vvn: any) => vvn.status === 'Approved' || vvn.status === 1);

      // 3. Obtener planes locales
      const existingPlans = await this.operationPlanRepo.findAll();

      // 4. Obtener IDs de Ejecuciones que tienen plan
      const executionIdsWithPlan = existingPlans.map(plan => plan.vesselVisitExecutionId.toString());

      // 5. Obtener todas las VVE locales para traducir ExecutionID -> VvnID
      const allLocalVVEs = await this.vveRepo.findAll();
      
      const vvnIdsWithPlans = allLocalVVEs
        .filter(vve => executionIdsWithPlan.includes(vve.id.toString()))
        .map(vve => vve.vvnId.toString());

      // 6. Filtrar las VVNs externas que NO están en la lista de planificadas
      const missingPlans = approvedVvns.filter((vvn: any) => !vvnIdsWithPlans.includes(vvn.id));

      // 7. Mapear a DTO
      return missingPlans.map((vvn: any) => ({
        vvnId: vvn.id,
        vesselName: vvn.vesselName, 
        imo: vvn.imo,
        eta: vvn.eta,
        status: vvn.status
      })) as MissingPlanVvnDTO[];

    } catch (error) {
      console.error("Error fetching missing plans:", error);
      throw new Error("Error fetching missing plans from Port Authority or processing data.");
    }
  }

  private toDTO(
    plan: OperationPlan
  ): OperationPlanDTO {
    return {
      id: plan.id.toString(),
      vesselVisitExecutionId: plan.vesselVisitExecutionId.toString(),
      createdAt: plan.createdAt.value.toISOString(),
      createdBy: plan.createdBy.value,
      algorithmUsed: plan.algorithmUsed.value
    };
  }
}