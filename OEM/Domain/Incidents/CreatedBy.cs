

namespace OEMAPI.Domain.Incidents
{
    public class CreatedBy : ValueObject
    {
        public string Value { get; }

        public CreatedBy(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Creator cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
