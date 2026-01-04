"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentSeverity = exports.IncidentSeverityEnum = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
var IncidentSeverityEnum;
(function (IncidentSeverityEnum) {
    IncidentSeverityEnum["MINOR"] = "MINOR";
    IncidentSeverityEnum["MAJOR"] = "MAJOR";
    IncidentSeverityEnum["CRITICAL"] = "CRITICAL";
})(IncidentSeverityEnum || (exports.IncidentSeverityEnum = IncidentSeverityEnum = {}));
class IncidentSeverity extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(severity) {
        return Result_1.Result.ok(new IncidentSeverity({ value: severity }));
    }
}
exports.IncidentSeverity = IncidentSeverity;
//# sourceMappingURL=IncidentSeverity.js.map