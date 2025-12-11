using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Incidents
{
    public class IncidentTypeId : ValueObject
    {
        public string Value { get; }

        public IncidentTypeId(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("IncidentType ID cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
