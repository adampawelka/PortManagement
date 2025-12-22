import {
  VesselVisitExecutionDTO,
  CreateVesselVisitExecutionDTO,
  UpdateVesselVisitExecutionDTO
} from "../../dto/VesselVisitExecutionDTO";

export interface IVesselVisitExecutionService {

  create(
    dto: CreateVesselVisitExecutionDTO
  ): Promise<VesselVisitExecutionDTO>;

  getById(
    id: string
  ): Promise<VesselVisitExecutionDTO | null>;

  getAll(): Promise<VesselVisitExecutionDTO[]>;

  update(
    id: string,
    dto: UpdateVesselVisitExecutionDTO
  ): Promise<VesselVisitExecutionDTO | null>;
}
