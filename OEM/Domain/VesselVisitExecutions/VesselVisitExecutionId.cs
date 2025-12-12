namespace OEMAPI.Domain.VesselVisitExecutions
{
    public class VesselVisitExecutionId : EntityId
    {
        [JsonConstructor]
        public VesselVisitExecutionId(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Vessel Visit Execution ID cannot be empty.");
        }

        protected override object createFromString(string text)
        {
            return text;
        }

        public override string AsString() => Value;
    }
}
