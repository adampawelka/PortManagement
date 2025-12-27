import { ComplementaryTask } from "../Domain/ComplementaryTasks/ComplementaryTask";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class ComplementaryTaskMap {

  static toPersistence(task: ComplementaryTask): any {
    return {
      domainId: task.id.toString(),
      vesselVisitExecutionId: task.vesselVisitExecutionId.id.toString(),
      categoryId: task.categoryId.id.toString(),
      responsibleTeam: task.responsibleTeam.value,
      startTime: task.startTime.value,
      endTime: task.endTime?.value ?? null,
      status: task.status.value
    };
  }

  static toDomain(raw: any): ComplementaryTask {
    const data = raw.toObject ? raw.toObject() : raw;

    const taskOrError = ComplementaryTask.create(
      {
        vesselVisitExecutionId: data.vesselVisitExecutionId,
        categoryId: data.categoryId,
        responsibleTeam: data.responsibleTeam,
        startTime: data.startTime,
        endTime: data.endTime ?? undefined,
        status: data.status
      },
      new UniqueEntityID(data.domainId)
    );

    if (taskOrError.isFailure) {
      throw new Error(taskOrError.errorValue().toString());
    }

    return taskOrError.getValue();
  }
}
