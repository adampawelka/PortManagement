"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Incident = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
const IncidentId_1 = require("./IncidentId");
class Incident extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get incidentId() {
        return IncidentId_1.IncidentId.create(this.id);
    }
    get incidentTypeId() {
        return this.props.incidentTypeId;
    }
    get startTime() {
        return this.props.startTime;
    }
    get endTime() {
        return this.props.endTime;
    }
    get severity() {
        return this.props.severity;
    }
    get description() {
        return this.props.description;
    }
    get createdBy() {
        return this.props.createdBy;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.incidentTypeId, argumentName: "incidentTypeId" },
            { argument: props.startTime, argumentName: "startTime" },
            { argument: props.severity, argumentName: "severity" },
            { argument: props.description, argumentName: "description" },
            { argument: props.createdBy, argumentName: "createdBy" }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        const incident = new Incident(Object.assign({}, props), id);
        return Result_1.Result.ok(incident);
    }
}
exports.Incident = Incident;
//# sourceMappingURL=Incident.js.map