namespace OEMAPI.Domain.OperatorPlans
{
    public class AlgorithmUsed : ValueObject
    {
        public string Value { get; }

        public AlgorithmUsed(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Algorithm Used cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
