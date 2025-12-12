namespace OEMAPI.Domain.OperationPlans
{
    public class VveId : ValueObject
    {
        public string Value { get; }

        public VveId(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("VVE ID cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
