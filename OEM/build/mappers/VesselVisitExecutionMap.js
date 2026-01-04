"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VesselVisitExecutionMap = void 0;
const VesselVisitExecution_1 = require("../Domain/VesselVisitExecutions/VesselVisitExecution");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const VvnId_1 = require("../Domain/VesselVisitExecutions/VvnId");
const ActualArrivalTime_1 = require("../Domain/VesselVisitExecutions/ActualArrivalTime");
const ActualBerthTime_1 = require("../Domain/VesselVisitExecutions/ActualBerthTime");
const DockId_1 = require("../Domain/VesselVisitExecutions/DockId");
const VesselVisitExecutionStatus_1 = require("../Domain/VesselVisitExecutions/VesselVisitExecutionStatus");
const CreatedBy_1 = require("../Domain/VesselVisitExecutions/CreatedBy");
class VesselVisitExecutionMap {
    static toPersistence(vve) {
        var _a, _b, _c, _d;
        return {
            domainId: vve.id.toString(),
            vvnId: vve.vvnId.value,
            actualArrivalTime: vve.actualArrivalTime.value,
            actualBerthTime: (_b = (_a = vve.actualBerthTime) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null,
            dockId: (_d = (_c = vve.dockId) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : null,
            status: vve.status.value,
            createdBy: vve.createdBy.value
        };
    }
    static toDomain(raw) {
        const data = raw.toObject ? raw.toObject() : raw;
        const vveOrError = VesselVisitExecution_1.VesselVisitExecution.create({
            vvnId: VvnId_1.VvnId.create(data.vvnId).getValue(),
            actualArrivalTime: ActualArrivalTime_1.ActualArrivalTime.create(data.actualArrivalTime).getValue(),
            actualBerthTime: data.actualBerthTime
                ? ActualBerthTime_1.ActualBerthTime.create(data.actualBerthTime).getValue()
                : undefined,
            dockId: data.dockId
                ? DockId_1.DockId.create(data.dockId).getValue()
                : undefined,
            status: VesselVisitExecutionStatus_1.VesselVisitExecutionStatus.create(data.status).getValue(),
            createdBy: CreatedBy_1.CreatedBy.create(data.createdBy).getValue()
        }, new UniqueEntityID_1.UniqueEntityID(data.domainId));
        if (vveOrError.isFailure) {
            throw new Error(vveOrError.errorValue().toString());
        }
        return vveOrError.getValue();
    }
}
exports.VesselVisitExecutionMap = VesselVisitExecutionMap;
//# sourceMappingURL=VesselVisitExecutionMap.js.map