namespace OEMAPI.Domain.IncidentTypes
{
    public class IncidentTypeSeverity : ValueObject
    {
        public string Value { get; }

        public IncidentTypeSeverity(string value)
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
