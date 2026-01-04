"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VesselVisitExecution = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
const VesselVisitExecutionId_1 = require("./VesselVisitExecutionId");
const VesselVisitExecutionStatus_1 = require("./VesselVisitExecutionStatus");
class VesselVisitExecution extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get vesselVisitExecutionId() {
        return VesselVisitExecutionId_1.VesselVisitExecutionId.create(this.id);
    }
    get vvnId() {
        return this.props.vvnId;
    }
    get actualArrivalTime() {
        return this.props.actualArrivalTime;
    }
    get actualBerthTime() {
        return this.props.actualBerthTime;
    }
    get dockId() {
        return this.props.dockId;
    }
    get status() {
        return this.props.status;
    }
    get createdBy() {
        return this.props.createdBy;
    }
    complete(unberth, departure) {
        if (this.status.value === VesselVisitExecutionStatus_1.VesselVisitExecutionStatusEnum.COMPLETED) {
            throw new Error("VVE already completed");
        }
        this.props.actualUnberthTime = unberth;
        this.props.actualPortDepartureTime = departure;
        this.props.status = VesselVisitExecutionStatus_1.VesselVisitExecutionStatus.create(VesselVisitExecutionStatus_1.VesselVisitExecutionStatusEnum.COMPLETED).getValue();
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.vvnId, argumentName: "vvnId" },
            { argument: props.actualArrivalTime, argumentName: "actualArrivalTime" },
            { argument: props.status, argumentName: "status" },
            { argument: props.createdBy, argumentName: "createdBy" }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        const vve = new VesselVisitExecution(Object.assign({}, props), id);
        return Result_1.Result.ok(vve);
    }
}
exports.VesselVisitExecution = VesselVisitExecution;
//# sourceMappingURL=VesselVisitExecution.js.map