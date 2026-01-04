import { VesselVisitExecution } from "../Domain/VesselVisitExecutions/VesselVisitExecution";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { VvnId } from "../Domain/VesselVisitExecutions/VvnId";
import { ActualArrivalTime } from "../Domain/VesselVisitExecutions/ActualArrivalTime";
import { ActualBerthTime } from "../Domain/VesselVisitExecutions/ActualBerthTime";
import { DockId } from "../Domain/VesselVisitExecutions/DockId";
import { VesselVisitExecutionStatus } from "../Domain/VesselVisitExecutions/VesselVisitExecutionStatus";
import { CreatedBy } from "../Domain/VesselVisitExecutions/CreatedBy";

export class VesselVisitExecutionMap {

  static toPersistence(vve: VesselVisitExecution): any {
    return {
      domainId: vve.id.toString(),
      vvnId: vve.vvnId.value,
      actualArrivalTime: vve.actualArrivalTime.value,
      actualBerthTime: vve.actualBerthTime?.value ?? null,
      dockId: vve.dockId?.value ?? null,
      status: vve.status.value,
      createdBy: vve.createdBy.value
    };
  }

  static toDomain(raw: any): VesselVisitExecution {
    const data = raw.toObject ? raw.toObject() : raw;

    const vveOrError = VesselVisitExecution.create(
      {
        vvnId: VvnId.create(data.vvnId).getValue(),
        actualArrivalTime: ActualArrivalTime.create(data.actualArrivalTime).getValue(),
        actualBerthTime: data.actualBerthTime
          ? ActualBerthTime.create(data.actualBerthTime).getValue()
          : undefined,
        dockId: data.dockId
          ? DockId.create(data.dockId).getValue()
          : undefined,
        status: VesselVisitExecutionStatus.create(data.status).getValue(),
        createdBy: CreatedBy.create(data.createdBy).getValue()
      },
      new UniqueEntityID(data.domainId)
    );

    if (vveOrError.isFailure) {
      throw new Error(vveOrError.errorValue().toString());
    }

    return vveOrError.getValue();
  }
}
