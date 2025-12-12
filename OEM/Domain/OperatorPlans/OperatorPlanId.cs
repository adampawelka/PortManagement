namespace OEMAPI.Domain.OperatorPlans
{
    public class OperatorPlanId : EntityId
    {
        [JsonConstructor]
        public OperatorPlanId(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Operator Plan ID cannot be empty.");
        }

        protected override object createFromString(string text)
        {
            return text;
        }

        public override string AsString() => Value;
    }
}
