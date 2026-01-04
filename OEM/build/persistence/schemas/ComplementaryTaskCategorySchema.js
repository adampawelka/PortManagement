"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ComplementaryTaskCategorySchema = new mongoose_1.default.Schema({
    domainId: {
        type: String,
        unique: true,
        index: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("ComplementaryTaskCategory", ComplementaryTaskCategorySchema);
//# sourceMappingURL=ComplementaryTaskCategorySchema.js.map