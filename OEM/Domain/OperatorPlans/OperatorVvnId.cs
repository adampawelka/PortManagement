namespace OEMAPI.Domain.OperatorPlans
{
    public class OperatorVvnId : ValueObject
    {
        public string Value { get; }

        public OperatorVvnId(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Operator VVN ID cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}

