"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const IncidentTypeSchema = new mongoose_1.default.Schema({
    domainId: {
        type: String,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        required: true,
        enum: {
            values: ["Minor", "Major", "Critical"],
            message: '{VALUE} is not a valid severity'
        }
    },
    parentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "IncidentType",
        default: null,
        index: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("IncidentType", IncidentTypeSchema);
//# sourceMappingURL=IncidentTypeSchema.js.map