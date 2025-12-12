namespace OEMAPI.Domain.PlannedOperations
{
    public class OperationType : ValueObject
    {
        public string Value { get; }

        public OperationType(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Operation Type cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
