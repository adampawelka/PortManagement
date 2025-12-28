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
 
  findByVVN(vvnId: string): Promise<VesselVisitExecution[]>;

  findInProgress(): Promise<VesselVisitExecution[]>;

  exists(vve: VesselVisitExecution): Promise<boolean>;
}
