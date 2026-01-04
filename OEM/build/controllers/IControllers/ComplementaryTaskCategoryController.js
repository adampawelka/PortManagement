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
let ComplementaryTaskCategoryController = class ComplementaryTaskCategoryController {
    constructor(categoryServiceInstance) {
        this.categoryServiceInstance = categoryServiceInstance;
    }
    // POST: /complementaryTaskCategories
    async createCategory(req, res, next) {
        try {
            const categoryDTO = await this.categoryServiceInstance.create(req.body);
            return res.status(201).json(categoryDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // GET: /complementaryTaskCategories/:id
    async getCategory(req, res, next) {
        try {
            const categoryDTO = await this.categoryServiceInstance.getById(req.params.id);
            if (!categoryDTO)
                return res.status(404).send("Category not found");
            return res.status(200).json(categoryDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // GET: /complementaryTaskCategories
    async getAll(req, res, next) {
        try {
            const categoriesDTO = await this.categoryServiceInstance.getAll();
            return res.status(200).json(categoriesDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
};
ComplementaryTaskCategoryController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.complementaryTaskCategory.name)),
    __metadata("design:paramtypes", [Object])
], ComplementaryTaskCategoryController);
exports.default = ComplementaryTaskCategoryController;
//# sourceMappingURL=ComplementaryTaskCategoryController.js.map