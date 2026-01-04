"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ComplementaryTaskSchema = new mongoose_1.default.Schema({
    domainId: {
        type: String,
        unique: true,
        index: true
    },
    vesselVisitExecutionId: {
        type: String,
        required: true,
        index: true
    },
    categoryId: {
        type: String,
        required: true,
        index: true
    },
    responsibleTeam: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("ComplementaryTask", ComplementaryTaskSchema);
//# sourceMappingURL=ComplementaryTaskSchema.js.map