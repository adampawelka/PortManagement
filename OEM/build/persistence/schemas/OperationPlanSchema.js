"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OperationPlanSchema = new mongoose_1.default.Schema({
    domainId: {
        type: String,
        unique: true,
        required: true
    },
    vvnId: {
        type: String,
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        required: true,
        index: true
    },
    createdBy: {
        type: String,
        required: true
    },
    algorithmUsed: {
        type: String,
        required: true
    },
    schedule: {
        type: [
            {
                vesselName: { type: String, required: true },
                start: { type: Date, required: true },
                end: { type: Date, required: true },
                delay: { type: Number, default: 0 },
                dock: { type: String },
                cranes: { type: [String], default: [] },
                staff: { type: [String], default: [] }
            }
        ],
        default: []
    }
}, {
    timestamps: false
});
// =======================
// Indexes
// =======================
// date range queries
OperationPlanSchema.index({ createdAt: 1 });
// vvn + date
OperationPlanSchema.index({ vvnId: 1, createdAt: 1 });
// operation date queries
OperationPlanSchema.index({ "schedule.start": 1 });
// vessel schedule search
OperationPlanSchema.index({ "schedule.vesselName": 1, "schedule.start": 1 });
exports.default = mongoose_1.default.model("OperationPlan", OperationPlanSchema);
//# sourceMappingURL=OperationPlanSchema.js.map