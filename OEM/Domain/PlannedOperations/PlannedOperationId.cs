namespace OEMAPI.Domain.PlannedOperations
{
    public class PlannedOperationId : EntityId
    {
        [JsonConstructor]
        public PlannedOperationId(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Planned Operation ID cannot be empty.");
        }

        protected override object createFromString(string text)
        {
            return text;
        }

        public override string AsString() => Value;
    }
}
