"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const VesselVisitExecutionSchema = new mongoose_1.default.Schema({
    domainId: {
        type: String,
        unique: true,
        required: true
    },
    vvnId: {
        type: String,
        required: true
    },
    actualArrivalTime: {
        type: Date,
        required: true
    },
    actualBerthTime: {
        type: Date,
        required: false
    },
    dockId: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("VesselVisitExecution", VesselVisitExecutionSchema);
//# sourceMappingURL=VesselVisitExecutionSchema.js.map