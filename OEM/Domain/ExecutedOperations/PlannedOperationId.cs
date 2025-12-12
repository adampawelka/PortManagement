namespace OEMAPI.Domain.ExecutedOperations
{
    public class PlannedOperationId : ValueObject
    {
        public string Value { get; }

        public PlannedOperationId(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Planned Operation ID cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
