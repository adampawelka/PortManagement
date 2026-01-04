"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ExecutedOperationSchema = new mongoose_1.default.Schema({
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
    plannedOperationId: {
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
    actualStart: {
        type: Date,
        required: true
    },
    actualEnd: {
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
exports.default = mongoose_1.default.model("ExecutedOperation", ExecutedOperationSchema);
//# sourceMappingURL=ExecutedOperationSchema.js.map