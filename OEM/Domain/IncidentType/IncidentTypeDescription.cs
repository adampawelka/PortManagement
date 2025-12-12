namespace OEMAPI.Domain.Incidents
{
    public class IncidentTypeDescription : ValueObject
    {
        public string Value { get; }

        public IncidentTypeDescription(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Incident type description cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
