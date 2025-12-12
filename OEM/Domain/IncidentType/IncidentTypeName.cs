namespace OEMAPI.Domain.Incidents
{
    public class IncidentTypeName : ValueObject
    {
        public string Value { get; }

        public IncidentTypeName(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Incident type name cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
