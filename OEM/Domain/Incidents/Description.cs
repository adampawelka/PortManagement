

namespace OEMAPI.Domain.Incidents
{
    public class Description : ValueObject
    {
        public string Value { get; }

        public Description(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Description cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
