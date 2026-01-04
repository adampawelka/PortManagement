"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VesselVisitExecutionStatus = exports.VesselVisitExecutionStatusEnum = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
var VesselVisitExecutionStatusEnum;
(function (VesselVisitExecutionStatusEnum) {
    VesselVisitExecutionStatusEnum["IN_PROGRESS"] = "IN_PROGRESS";
    VesselVisitExecutionStatusEnum["COMPLETED"] = "COMPLETED";
})(VesselVisitExecutionStatusEnum || (exports.VesselVisitExecutionStatusEnum = VesselVisitExecutionStatusEnum = {}));
class VesselVisitExecutionStatus extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(status) {
        return Result_1.Result.ok(new VesselVisitExecutionStatus({ value: status }));
    }
}
exports.VesselVisitExecutionStatus = VesselVisitExecutionStatus;
//# sourceMappingURL=VesselVisitExecutionStatus.js.map