import {
  VesselVisitExecutionDTO,
  CreateVesselVisitExecutionDTO,
  UpdateVesselVisitExecutionDTO,
  VveSearchCriteriaDTO, // <--- Importar
  VveSearchDTO
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

  // Nuevo método para US 4.1.10
  search(criteria: VveSearchCriteriaDTO): Promise<VveSearchDTO[]>;
}
