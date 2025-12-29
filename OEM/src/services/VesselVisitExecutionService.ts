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
    const vvnExists = await this.vvnClient.vvnExists(dto.vvnId);
    if (!vvnExists) {
      throw new Error(`Vessel Visit Notification (VVN) with ID ${dto.vvnId} does not exist`);
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

    const vveId = VesselVisitExecutionId.create(
      new UniqueEntityID(id)
    );

    const vve = await this.vveRepo.findById(vveId);
    if (!vve) return null;

    return this.toDTO(vve);
  }

  async getAll(): Promise<VesselVisitExecutionDTO[]> {
    const vves = await this.vveRepo.findAll();
    return vves.map(vve => this.toDTO(vve));
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
    return {
      id: vve.id.toString(),
      vvnId: vve.vvnId.toString(),
      actualArrivalTime: vve.actualArrivalTime.value.toISOString(),
      actualBerthTime: vve.actualBerthTime
        ? vve.actualBerthTime.value.toISOString()
        : undefined,
      dockId: vve.dockId
        ? vve.dockId.toString()
        : undefined,
      status: vve.status.value,
      createdBy: vve.createdBy.value
    };
  }
}
