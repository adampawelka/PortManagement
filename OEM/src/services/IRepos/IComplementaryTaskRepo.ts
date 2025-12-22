import { ComplementaryTask } from "../../Domain/ComplementaryTasks/ComplementaryTask";
import { ComplementaryTaskId } from "../../Domain/ComplementaryTasks/ComplementaryTaskId";
import { VesselVisitExecutionId } from "../../Domain/VesselVisitExecutions/VesselVisitExecutionId";

export interface IComplementaryTaskRepo {
  save(task: ComplementaryTask): Promise<void>;
  findById(id: ComplementaryTaskId): Promise<ComplementaryTask | null>;
  findByVesselVisitExecutionId(
    vveId: VesselVisitExecutionId
  ): Promise<ComplementaryTask[]>;
  findall(): Promise<ComplementaryTask[]>;
  exists(id: ComplementaryTaskId): Promise<boolean>;
}
