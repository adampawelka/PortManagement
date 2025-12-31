import { IVesselVisitExecutionService } from "./IServices/IVesselVisitExecutionService";
import { IVesselVisitExecutionRepo } from "./IRepos/IVesselVisitExecutionRepo";

import {
  VesselVisitExecutionDTO,
  CreateVesselVisitExecutionDTO,
  UpdateVesselVisitExecutionDTO
} from "../dto/VesselVisitExecutionDTO";

import { VesselVisitExecution } from "../Domain/VesselVisitExecutions/VesselVisitExecution";
import { VesselVisitExecutionId } from "../Domain/VesselVisitExecutions/VesselVisitExecutionId";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { VvnId } from "../Domain/VesselVisitExecutions/VvnId";
import { ActualArrivalTime } from "../Domain/VesselVisitExecutions/ActualArrivalTime";
import { ActualBerthTime } from "../Domain/VesselVisitExecutions/ActualBerthTime";
import { DockId } from "../Domain/VesselVisitExecutions/DockId";
import {
  VesselVisitExecutionStatus,
  VesselVisitExecutionStatusEnum
} from "../Domain/VesselVisitExecutions/VesselVisitExecutionStatus";
import { CreatedBy } from "../Domain/VesselVisitExecutions/CreatedBy";
import { VvnClientService } from "./VvnClientService";

export class VesselVisitExecutionService
  implements IVesselVisitExecutionService {

  constructor(
    private readonly vveRepo: IVesselVisitExecutionRepo,
    private readonly vvnClient: VvnClientService
  ) { }

  async create(
    dto: CreateVesselVisitExecutionDTO
  ): Promise<VesselVisitExecutionDTO> {

    // Validate that the referenced VVN exists (US 4.1.7)
    // If validation fails due to network/auth issues, log warning but continue
    try {
      const vvnExists = await this.vvnClient.vvnExists(dto.vvnId);
      if (!vvnExists) {
        throw new Error(`Vessel Visit Notification (VVN) with ID ${dto.vvnId} does not exist`);
      }
    } catch (error: any) {
      // If it's a validation error (VVN doesn't exist), throw it
      if (error.message && error.message.includes('does not exist')) {
        throw error;
      }
      // For network/auth errors, log warning but allow creation to proceed
      // This prevents blocking VVE creation if Backend API is unavailable
      console.warn(`[VesselVisitExecutionService] Could not validate VVN existence: ${error.message}. Proceeding with VVE creation.`);
      // In production, you might want to make this stricter or use a service account
    }

    // VVE ID is automatically generated as UUID (matching VVN ID pattern)
    // No ID is passed to create(), so UniqueEntityID generates a new UUID
    // Status is automatically set to IN_PROGRESS when VVE is created (US 4.1.7)
    // dto.status is ignored - VVE is always created with IN_PROGRESS status
    const vveOrError = VesselVisitExecution.create({
      vvnId: VvnId.create(dto.vvnId).getValue(),
      actualArrivalTime: ActualArrivalTime.create(new Date(dto.actualArrivalTime)).getValue(),
      actualBerthTime: dto.actualBerthTime
        ? ActualBerthTime.create(new Date(dto.actualBerthTime)).getValue()
        : undefined,
      dockId: dto.dockId
        ? DockId.create(dto.dockId).getValue()
        : undefined,
      status: VesselVisitExecutionStatus.create(
        VesselVisitExecutionStatusEnum.IN_PROGRESS
      ).getValue(),  // Always set to IN_PROGRESS on creation, ignoring dto.status (US 4.1.7)
      createdBy: CreatedBy.create(dto.createdBy).getValue()
    });


    if (vveOrError.isFailure) {
      throw new Error(vveOrError.errorValue().toString());
    }

    const vve = vveOrError.getValue();
    await this.vveRepo.save(vve);

    return this.toDTO(vve);
  }

  async getById(
    id: string
  ): Promise<VesselVisitExecutionDTO | null> {
    try {
      console.log(`[VesselVisitExecutionService] Getting VVE by ID: ${id}`);
      
      const vveId = VesselVisitExecutionId.create(
        new UniqueEntityID(id)
      );

      const vve = await this.vveRepo.findById(vveId);
      console.log(`[VesselVisitExecutionService] Found VVE:`, vve ? "Yes" : "No");
      
      if (!vve) return null;

      const dto = this.toDTO(vve);
      console.log(`[VesselVisitExecutionService] Successfully converted to DTO`);
      return dto;
    } catch (error: any) {
      console.error(`[VesselVisitExecutionService] Error in getById:`, error);
      throw error;
    }
  }

  async getAll(): Promise<VesselVisitExecutionDTO[]> {
    try {
      console.log("[VesselVisitExecutionService] Getting all VVEs...");
      const vves = await this.vveRepo.findAll();
      console.log(`[VesselVisitExecutionService] Found ${vves.length} VVEs`);
      const dtos = vves.map(vve => {
        try {
          return this.toDTO(vve);
        } catch (error: any) {
          console.error(`[VesselVisitExecutionService] Error converting VVE to DTO:`, error);
          throw error;
        }
      });
      console.log("[VesselVisitExecutionService] Successfully converted all VVEs to DTOs");
      return dtos;
    } catch (error: any) {
      console.error("[VesselVisitExecutionService] Error in getAll():", error);
      throw error;
    }
  }

  async update(
    id: string,
    dto: UpdateVesselVisitExecutionDTO
  ): Promise<VesselVisitExecutionDTO | null> {

    const vveId = VesselVisitExecutionId.create(
      new UniqueEntityID(id)
    );

    const vve = await this.vveRepo.findById(vveId);
    if (!vve) return null;

    if (dto.actualArrivalTime) {
      vve.props.actualArrivalTime =
        ActualArrivalTime.create(new Date(dto.actualArrivalTime)).getValue();
    }

    if (dto.actualBerthTime) {
      vve.props.actualBerthTime =
        ActualBerthTime.create(new Date(dto.actualBerthTime)).getValue();
    }

    if (dto.dockId) {
      vve.props.dockId = DockId.create(dto.dockId).getValue();
    }


    if (dto.status) {
      vve.props.status =
        VesselVisitExecutionStatus.create(
          dto.status as VesselVisitExecutionStatusEnum
        ).getValue();
    }

    await this.vveRepo.save(vve);
    return this.toDTO(vve);
  }

  private toDTO(
    vve: VesselVisitExecution
  ): VesselVisitExecutionDTO {
    try {
      return {
        id: vve.id.toString(),
        vvnId: vve.vvnId.value, // VvnId is a ValueObject, use .value to get the string
        actualArrivalTime: vve.actualArrivalTime.value.toISOString(),
        actualBerthTime: vve.actualBerthTime
          ? vve.actualBerthTime.value.toISOString()
          : undefined,
        dockId: vve.dockId
          ? vve.dockId.value  // DockId is a ValueObject, use .value to get the string
          : undefined,
        status: vve.status.value,
        createdBy: vve.createdBy.value
      };
    } catch (error: any) {
      console.error(`[VesselVisitExecutionService] Error in toDTO for VVE ${vve.id.toString()}:`, error);
      throw new Error(`Failed to convert VVE to DTO: ${error.message}`);
    }
  }
}
