namespace OEMAPI.Domain.IncidentTypes
{
    public class IncidentTypeCode : ValueObject
    {
        public string Value { get; }

        public IncidentTypeCode(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Incident type code cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
