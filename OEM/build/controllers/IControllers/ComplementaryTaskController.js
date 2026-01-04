"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../../../config"));
let ComplementaryTaskController = class ComplementaryTaskController {
    constructor(taskServiceInstance) {
        this.taskServiceInstance = taskServiceInstance;
    }
    // POST: /complementaryTasks (US 4.1.15)
    async createTask(req, res, next) {
        try {
            const taskDTO = await this.taskServiceInstance.create(req.body);
            return res.status(201).json(taskDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // GET: /complementaryTasks/vve/:vveId
    async getByVVE(req, res, next) {
        try {
            const tasksDTO = await this.taskServiceInstance.getByVesselVisitExecutionId(req.params.vveId);
            return res.status(200).json(tasksDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // GET: /complementaryTasks
    async getAll(req, res, next) {
        try {
            const tasksDTO = await this.taskServiceInstance.getAll();
            return res.status(200).json(tasksDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // PUT/PATCH: /complementaryTasks/:id
    async updateTask(req, res, next) {
        try {
            const taskDTO = await this.taskServiceInstance.update(req.params.id, req.body);
            if (!taskDTO)
                return res.status(404).send("Task not found");
            return res.status(200).json(taskDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
};
ComplementaryTaskController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.complementaryTask.name)),
    __metadata("design:paramtypes", [Object])
], ComplementaryTaskController);
exports.default = ComplementaryTaskController;
//# sourceMappingURL=ComplementaryTaskController.js.map