import { IVesselVisitExecutionService } from "./IServices/IVesselVisitExecutionService";
import { IVesselVisitExecutionRepo } from "./IRepos/IVesselVisitExecutionRepo";

import {
  VesselVisitExecutionDTO,
  CreateVesselVisitExecutionDTO,
  UpdateVesselVisitExecutionDTO,
  VveSearchCriteriaDTO,
  VveSearchDTO
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
    console.log(`[VesselVisitExecutionService] CREATE METHOD CALLED with VVN ID: ${dto.vvnId}`);

    // Check for duplicate VVE - prevent creating multiple VVEs for the same VVN
    console.log(`[VesselVisitExecutionService] Checking for duplicate VVE for VVN: ${dto.vvnId}`);
    const existingVves = await this.vveRepo.findByVVN(dto.vvnId);
    console.log(`[VesselVisitExecutionService] Found ${existingVves.length} existing VVE(s) for VVN ${dto.vvnId}`);
    if (existingVves.length > 0) {
      const errorMsg = `A Vessel Visit Execution (VVE) already exists for VVN ${dto.vvnId}. Cannot create duplicate VVE.`;
      console.error(`[VesselVisitExecutionService] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // Validate that the referenced VVN exists and is APPROVED (US 4.1.7)
    let vvnValidationError: Error | null = null;
    try {
      console.log(`[VesselVisitExecutionService] Validating VVN: ${dto.vvnId}`);
      const vvn = await this.vvnClient.getVvnById(dto.vvnId);
      
      if (!vvn) {
        vvnValidationError = new Error(`Vessel Visit Notification (VVN) with ID ${dto.vvnId} does not exist`);
        throw vvnValidationError;
      }
      
      // Log the full VVN object for debugging
      console.log(`[VesselVisitExecutionService] VVN retrieved:`, JSON.stringify(vvn, null, 2));
      
      // Check status (case-insensitive comparison)
      // Try multiple possible field names: status, visitStatus, VisitStatus
      const vvnStatus = (vvn.status || (vvn as any).visitStatus || (vvn as any).VisitStatus || '').toString().toUpperCase();
      console.log(`[VesselVisitExecutionService] VVN status check: received="${vvn.status || (vvn as any).visitStatus || (vvn as any).VisitStatus}", normalized="${vvnStatus}"`);
      
      if (!vvnStatus || vvnStatus !== 'APPROVED') {
        vvnValidationError = new Error(`Cannot create VVE for VVN with status "${vvn.status || (vvn as any).visitStatus || (vvn as any).VisitStatus}". VVN must be APPROVED.`);
        console.error(`[VesselVisitExecutionService] ${vvnValidationError.message}`);
        throw vvnValidationError;
      }
      
      console.log(`[VesselVisitExecutionService] VVN validation passed - status is APPROVED`);
    } catch (error: any) {
      // If it's our validation error, always throw it (this should never be caught and swallowed)
      if (vvnValidationError) {
        console.error(`[VesselVisitExecutionService] Throwing validation error: ${vvnValidationError.message}`);
        throw vvnValidationError;
      }
      
      // If it's a validation error (VVN doesn't exist or wrong status), throw it
      if (error.message && (
        error.message.includes('does not exist') || 
        error.message.includes('must be APPROVED') ||
        error.message.includes('Cannot create VVE')
      )) {
        console.error(`[VesselVisitExecutionService] Throwing validation error: ${error.message}`);
        throw error;
      }
      
      // For authentication errors (401), block VVE creation - we cannot validate VVN status
      if (error.message && error.message.includes('401')) {
        throw new Error(`Cannot create VVE: Authentication failed when validating VVN. Please ensure OEM backend is properly configured to access Backend API.`);
      }
      
      // For network/timeout errors, log warning but allow creation to proceed
      // This prevents blocking VVE creation if Backend API is temporarily unavailable
      console.warn(`[VesselVisitExecutionService] Could not validate VVN: ${error.message}. Proceeding with VVE creation.`);
      console.warn(`[VesselVisitExecutionService] Error type: ${error.constructor.name}, Stack: ${error.stack}`);
    }

    if (dto.actualBerthTime) {
      const arrivalTime = new Date(dto.actualArrivalTime);
      const berthTime = new Date(dto.actualBerthTime);
      if (berthTime < arrivalTime) {
        throw new Error("Actual Berth Time must be after Actual Arrival Time");
      }
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

  // --- IMPLEMENTACIÓN US 4.1.10 ---
  async search(criteria: VveSearchCriteriaDTO): Promise<VveSearchDTO[]> {
    try {
      console.log("[VVE Service] Searching with criteria:", criteria);

      // 1. Obtener TODAS las ejecuciones (ya que la DB no soporta filtros complejos aún)
      const allVves = await this.vveRepo.findAll();
      
      // 2. Filtrado en Memoria
      let filteredVves = allVves;

      // Filtro por Fecha (Start/End basado en ActualArrivalTime)
      if (criteria.dateStart) {
        const start = new Date(criteria.dateStart);
        filteredVves = filteredVves.filter(vve => vve.actualArrivalTime.value >= start);
      }
      if (criteria.dateEnd) {
        const end = new Date(criteria.dateEnd);
        // Ajustamos al final del día si es necesario, o comparación directa
        filteredVves = filteredVves.filter(vve => vve.actualArrivalTime.value <= end);
      }

      // Filtro por Estado
      if (criteria.status) {
        filteredVves = filteredVves.filter(vve => vve.status.value === criteria.status);
      }

      // 3. Mapeo a DTO con Métricas y Nombre del Buque
      const results: VveSearchDTO[] = [];

      for (const vve of filteredVves) {
        // Obtener nombre del buque (Simulado o via Cliente VVN)
        // Lo ideal sería: const details = await this.vvnClient.getDetails(vve.vvnId.value);
        // Por ahora, devolvemos "Unknown" o el ID si no tenemos el servicio de nombres listo
        let vesselName = "Unknown Vessel"; 
        try {
             // Si tu vvnClient tiene un método para obtener datos, úsalo aquí.
             // Si no, filtraremos por vvnId si criteria.vesselName se usa como ID.
             vesselName = `Vessel (VVN: ${vve.vvnId.value.substring(0,8)}...)`; 
        } catch (e) { console.warn("Could not fetch vessel name"); }

        // Si hay filtro por Vessel (Nombre o ID), aplicarlo aquí
        if (criteria.vesselName && !vesselName.includes(criteria.vesselName) && !vve.vvnId.value.includes(criteria.vesselName)) {
            continue; 
        }

        // --- CÁLCULO DE MÉTRICAS ---
        const arrival = vve.actualArrivalTime.value;
        const berth = vve.actualBerthTime ? vve.actualBerthTime.value : null;
        // Asumimos que tienes una propiedad departure o un método para obtenerla. 
        // Si no existe en el dominio actual, usamos null (visita en curso).
        // const departure = vve.actualDepartureTime ? vve.actualDepartureTime.value : null; 
        const departure = null; // Placeholder hasta que implementes US 4.1.11

        // Cálculo de minutos (diferencia en ms / 1000 / 60)
        const waitingTime = berth ? Math.floor((berth.getTime() - arrival.getTime()) / (1000 * 60)) : 0;
        const occupancy = (berth && departure) ? Math.floor((departure.getTime() - berth.getTime()) / (1000 * 60)) : 0;
        const turnaround = departure ? Math.floor((departure.getTime() - arrival.getTime()) / (1000 * 60)) : 0;

        results.push({
          id: vve.id.toString(),
          vvnId: vve.vvnId.value,
          vesselName: vesselName,
          arrival: arrival.toISOString(),
          berth: berth ? berth.toISOString() : undefined,
          departure: departure ? departure.toISOString() : undefined,
          status: vve.status.value,
          waitingTimeMinutes: waitingTime,
          berthOccupancyMinutes: occupancy,
          totalTurnaroundMinutes: turnaround
        });
      }

      return results;

    } catch (error: any) {
      console.error("[VVE Service] Error searching:", error);
      throw new Error("Failed to search vessel visit executions.");
    }
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
