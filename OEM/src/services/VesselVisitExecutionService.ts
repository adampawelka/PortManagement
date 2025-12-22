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

export class VesselVisitExecutionService
  implements IVesselVisitExecutionService {

  constructor(
    private readonly vveRepo: IVesselVisitExecutionRepo
  ) {}

  async create(
    dto: CreateVesselVisitExecutionDTO
  ): Promise<VesselVisitExecutionDTO> {

    const vveOrError = VesselVisitExecution.create({
      vvnId: VvnId.caller(
        new UniqueEntityID(dto.vvnId)
      ),
      actualArrivalTime: ActualArrivalTime.create(
        new Date(dto.actualArrivalTime)
      ).getValue(),
      actualBerthTime: dto.actualBerthTime
        ? ActualBerthTime.create(new Date(dto.actualBerthTime)).getValue()
        : undefined,
      dockId: dto.dockId
        ? DockId.caller(new UniqueEntityID(dto.dockId))
        : undefined,
      status: VesselVisitExecutionStatus.create(
        dto.status as VesselVisitExecutionStatusEnum
      ).getValue(),
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

    const vveId = VesselVisitExecutionId.caller(
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

    const vveId = VesselVisitExecutionId.caller(
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
      vve.props.dockId =
        DockId.caller(new UniqueEntityID(dto.dockId));
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
