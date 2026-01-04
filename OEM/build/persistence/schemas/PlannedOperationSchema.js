"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PlannedOperationSchema = new mongoose_1.default.Schema({
    domainId: {
        type: String,
        unique: true,
        index: true
    },
    operationPlanId: {
        type: String,
        required: true,
        index: true
    },
    resourceId: {
        type: String,
        required: true
    },
    staffId: {
        type: String,
        required: true
    },
    plannedStart: {
        type: Date,
        required: true
    },
    plannedEnd: {
        type: Date,
        required: true
    },
    operationType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("PlannedOperation", PlannedOperationSchema);
//# sourceMappingURL=PlannedOperationSchema.js.map