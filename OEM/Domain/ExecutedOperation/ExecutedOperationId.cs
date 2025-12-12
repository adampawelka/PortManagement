namespace OEMAPI.Domain.OperationPlans
{
    public class ExecutedOperationId : EntityId
    {
        [JsonConstructor]
        public ExecutedOperationId(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Executed Operation ID cannot be empty.");
        }

        protected override object createFromString(string text)
        {
            return text;
        }

        public override string AsString() => Value;
    }
}
