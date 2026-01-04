import { IComplementaryTaskService } from "./IServices/IComplementaryTaskService";
import { IComplementaryTaskRepo } from "./IRepos/IComplementaryTaskRepo";

import {
  ComplementaryTaskDTO,
  CreateComplementaryTaskDTO,
  UpdateComplementaryTaskDTO
} from "../dto/ComplementaryTaskDTO";

import { ComplementaryTask } from "../Domain/ComplementaryTasks/ComplementaryTask";
import { ComplementaryTaskId } from "../Domain/ComplementaryTasks/ComplementaryTaskId";
import { VesselVisitExecutionId } from "../Domain/VesselVisitExecutions/VesselVisitExecutionId";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { ComplementaryTaskCategoryId } from "../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryId";
import { ResponsibleTeam } from "../Domain/ComplementaryTasks/ResponsibleTeam";
import { StartTime } from "../Domain/ComplementaryTasks/StartTime";
import { EndTime } from "../Domain/ComplementaryTasks/EndTime";
import { ComplementaryTaskStatus, ComplementaryTaskStatusEnum } from "../Domain/ComplementaryTasks/ComplementaryTaskStatus";
import { ComplementaryTaskExecutionMode, ComplementaryTaskExecutionModeEnum } from "../Domain/ComplementaryTasks/ComplementaryTaskExecutionMode";

export class ComplementaryTaskService
  implements IComplementaryTaskService {

  constructor(
    private readonly taskRepo: IComplementaryTaskRepo
  ) { }

  // --------------------
  // CREATE
  // --------------------
  async create(
    dto: CreateComplementaryTaskDTO
  ): Promise<ComplementaryTaskDTO> {

    const taskOrError = ComplementaryTask.create({
      vesselVisitExecutionId: VesselVisitExecutionId.create(
        new UniqueEntityID(dto.vesselVisitExecutionId)
      ),
      categoryId: ComplementaryTaskCategoryId.create(
        new UniqueEntityID(dto.categoryId)
      ),
      responsibleTeam: ResponsibleTeam.create(dto.responsibleTeam).getValue(),
      startTime: StartTime.create(new Date(dto.startTime)).getValue(),
      endTime: dto.endTime
        ? EndTime.create(new Date(dto.endTime)).getValue()
        : undefined,
      status: ComplementaryTaskStatus.create(
        this.toStatusEnum(dto.status)
      ).getValue(),
      executionMode: dto.executionMode
        ? ComplementaryTaskExecutionMode.create(
          dto.executionMode as ComplementaryTaskExecutionModeEnum
        ).getValue()
        : undefined
    });


    if (taskOrError.isFailure) {
      throw new Error(taskOrError.errorValue().toString());
    }

    const task = taskOrError.getValue();
    await this.taskRepo.save(task);

    return this.toDTO(task);
  }

  // --------------------
  // GET BY ID
  // --------------------
  async getById(
    id: string
  ): Promise<ComplementaryTaskDTO | null> {

    const taskId = ComplementaryTaskId.create(
      new UniqueEntityID(id)
    );

    const task = await this.taskRepo.findById(taskId);
    if (!task) return null;

    return this.toDTO(task);
  }

  // --------------------
  // GET BY VVE ID
  // --------------------
  async getByVesselVisitExecutionId(
    vveId: string
  ): Promise<ComplementaryTaskDTO[]> {

    const vve = VesselVisitExecutionId.create(
      new UniqueEntityID(vveId)
    );

    const tasks = await this.taskRepo.findByVesselVisitExecutionId(vve);
    return tasks.map(task => this.toDTO(task));
  }

  // --------------------
  // GET ALL
  // --------------------
  async getAll(): Promise<ComplementaryTaskDTO[]> {
    const tasks = await this.taskRepo.findall();
    return tasks.map(task => this.toDTO(task));
  }

  // --------------------
  // UPDATE
  // --------------------
  async update(
    id: string,
    dto: UpdateComplementaryTaskDTO
  ): Promise<ComplementaryTaskDTO | null> {

    const taskId = ComplementaryTaskId.create(
      new UniqueEntityID(id)
    );

    const task = await this.taskRepo.findById(taskId);
    if (!task) return null;

    if (dto.responsibleTeam) {
      task.props.responsibleTeam =
        ResponsibleTeam.create(dto.responsibleTeam).getValue();
    }

    if (dto.startTime) {
      task.props.startTime =
        StartTime.create(new Date(dto.startTime)).getValue();
    }

    if (dto.endTime) {
      task.props.endTime =
        EndTime.create(new Date(dto.endTime)).getValue();
    }

    if (dto.status) {
      task.props.status =
        ComplementaryTaskStatus.create(
          this.toStatusEnum(dto.status)
        ).getValue();
    }

    await this.taskRepo.save(task);
    return this.toDTO(task);
  }

  // --------------------
  // PRIVATE HELPERS
  // --------------------
  private toStatusEnum(
    status: string
  ): ComplementaryTaskStatusEnum {

    if (!Object.values(ComplementaryTaskStatusEnum).includes(
      status as ComplementaryTaskStatusEnum
    )) {
      throw new Error(`Invalid ComplementaryTaskStatus: ${status}`);
    }

    return status as ComplementaryTaskStatusEnum;
  }

  private toDTO(
    task: ComplementaryTask
  ): ComplementaryTaskDTO {

    return {
      id: task.id.toString(),
      vesselVisitExecutionId: task.vesselVisitExecutionId.toString(),
      categoryId: task.categoryId.id.toString(),
      responsibleTeam: task.responsibleTeam.value,
      startTime: task.startTime.value.toISOString(),
      endTime: task.endTime
        ? task.endTime.value.toISOString()
        : undefined,
      status: task.status.value,
      executionMode: task.executionMode.value
    };
  }
}
