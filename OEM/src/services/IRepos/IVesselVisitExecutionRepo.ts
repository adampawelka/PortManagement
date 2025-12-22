import { VesselVisitExecution } from "../../Domain/VesselVisitExecutions/VesselVisitExecution";
import { VesselVisitExecutionId } from "../../Domain/VesselVisitExecutions/VesselVisitExecutionId";
import { VvnId } from "../../Domain/VesselVisitExecutions/VvnId";

export interface IVesselVisitExecutionRepo {
  save(vve: VesselVisitExecution): Promise<void>;

  findById(
    id: VesselVisitExecutionId
  ): Promise<VesselVisitExecution | null>;

  findByVvnId(
    vvnId: VvnId
  ): Promise<VesselVisitExecution | null>;

  findAll(): Promise<VesselVisitExecution[]>;
  
  exists(vve: VesselVisitExecution): Promise<boolean>;
}
