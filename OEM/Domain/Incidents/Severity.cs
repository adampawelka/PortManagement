

namespace OEMAPI.Domain.Incidents
{
    public class Severity : ValueObject
    {
        public string Value { get; }

        public Severity(string value)
        {
            if (value != "minor" && value != "major" && value != "critical")
                throw new BusinessRuleValidationException("Invalid severity level.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
