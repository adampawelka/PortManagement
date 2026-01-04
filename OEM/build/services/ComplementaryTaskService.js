"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryTaskService = void 0;
const ComplementaryTask_1 = require("../Domain/ComplementaryTasks/ComplementaryTask");
const ComplementaryTaskId_1 = require("../Domain/ComplementaryTasks/ComplementaryTaskId");
const VesselVisitExecutionId_1 = require("../Domain/VesselVisitExecutions/VesselVisitExecutionId");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const ComplementaryTaskCategoryId_1 = require("../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryId");
const ResponsibleTeam_1 = require("../Domain/ComplementaryTasks/ResponsibleTeam");
const StartTime_1 = require("../Domain/ComplementaryTasks/StartTime");
const EndTime_1 = require("../Domain/ComplementaryTasks/EndTime");
const ComplementaryTaskStatus_1 = require("../Domain/ComplementaryTasks/ComplementaryTaskStatus");
const ComplementaryTaskExecutionMode_1 = require("../Domain/ComplementaryTasks/ComplementaryTaskExecutionMode");
class ComplementaryTaskService {
    constructor(taskRepo) {
        this.taskRepo = taskRepo;
    }
    // --------------------
    // CREATE
    // --------------------
    async create(dto) {
        const taskOrError = ComplementaryTask_1.ComplementaryTask.create({
            vesselVisitExecutionId: VesselVisitExecutionId_1.VesselVisitExecutionId.create(new UniqueEntityID_1.UniqueEntityID(dto.vesselVisitExecutionId)),
            categoryId: ComplementaryTaskCategoryId_1.ComplementaryTaskCategoryId.create(new UniqueEntityID_1.UniqueEntityID(dto.categoryId)),
            responsibleTeam: ResponsibleTeam_1.ResponsibleTeam.create(dto.responsibleTeam).getValue(),
            startTime: StartTime_1.StartTime.create(new Date(dto.startTime)).getValue(),
            endTime: dto.endTime
                ? EndTime_1.EndTime.create(new Date(dto.endTime)).getValue()
                : undefined,
            status: ComplementaryTaskStatus_1.ComplementaryTaskStatus.create(this.toStatusEnum(dto.status)).getValue(),
            executionMode: dto.executionMode
                ? ComplementaryTaskExecutionMode_1.ComplementaryTaskExecutionMode.create(dto.executionMode).getValue()
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
    async getById(id) {
        const taskId = ComplementaryTaskId_1.ComplementaryTaskId.create(new UniqueEntityID_1.UniqueEntityID(id));
        const task = await this.taskRepo.findById(taskId);
        if (!task)
            return null;
        return this.toDTO(task);
    }
    // --------------------
    // GET BY VVE ID
    // --------------------
    async getByVesselVisitExecutionId(vveId) {
        const vve = VesselVisitExecutionId_1.VesselVisitExecutionId.create(new UniqueEntityID_1.UniqueEntityID(vveId));
        const tasks = await this.taskRepo.findByVesselVisitExecutionId(vve);
        return tasks.map(task => this.toDTO(task));
    }
    // --------------------
    // GET ALL
    // --------------------
    async getAll() {
        const tasks = await this.taskRepo.findall();
        return tasks.map(task => this.toDTO(task));
    }
    // --------------------
    // UPDATE
    // --------------------
    async update(id, dto) {
        const taskId = ComplementaryTaskId_1.ComplementaryTaskId.create(new UniqueEntityID_1.UniqueEntityID(id));
        const task = await this.taskRepo.findById(taskId);
        if (!task)
            return null;
        if (dto.responsibleTeam) {
            task.props.responsibleTeam =
                ResponsibleTeam_1.ResponsibleTeam.create(dto.responsibleTeam).getValue();
        }
        if (dto.startTime) {
            task.props.startTime =
                StartTime_1.StartTime.create(new Date(dto.startTime)).getValue();
        }
        if (dto.endTime) {
            task.props.endTime =
                EndTime_1.EndTime.create(new Date(dto.endTime)).getValue();
        }
        if (dto.status) {
            task.props.status =
                ComplementaryTaskStatus_1.ComplementaryTaskStatus.create(this.toStatusEnum(dto.status)).getValue();
        }
        await this.taskRepo.save(task);
        return this.toDTO(task);
    }
    // --------------------
    // PRIVATE HELPERS
    // --------------------
    toStatusEnum(status) {
        if (!Object.values(ComplementaryTaskStatus_1.ComplementaryTaskStatusEnum).includes(status)) {
            throw new Error(`Invalid ComplementaryTaskStatus: ${status}`);
        }
        return status;
    }
    toDTO(task) {
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
exports.ComplementaryTaskService = ComplementaryTaskService;
//# sourceMappingURL=ComplementaryTaskService.js.map