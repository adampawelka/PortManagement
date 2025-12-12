namespace OEMAPI.Domain.PlannedOperations
{
    public class ResourceId : ValueObject
    {
        public string Value { get; }

        public ResourceId(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Resource ID cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
