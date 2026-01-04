"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentType = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
const IncidentTypeId_1 = require("./IncidentTypeId");
class IncidentType extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get incidentTypeId() {
        return IncidentTypeId_1.IncidentTypeId.create(this.id);
    }
    get code() { return this.props.code; }
    get name() { return this.props.name; }
    get description() { return this.props.description; }
    get severity() { return this.props.severity; }
    get parentId() { return this.props.parentId; }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.code, argumentName: "code" },
            { argument: props.name, argumentName: "name" },
            { argument: props.description, argumentName: "description" },
            { argument: props.severity, argumentName: "severity" }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded)
            return Result_1.Result.fail(guardResult.message);
        return Result_1.Result.ok(new IncidentType(Object.assign({}, props), id));
    }
    setParent(parentId) {
        this.props.parentId = parentId;
    }
}
exports.IncidentType = IncidentType;
//# sourceMappingURL=IncidentType.js.map