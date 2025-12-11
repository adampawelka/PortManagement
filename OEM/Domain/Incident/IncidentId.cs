using DDDSample1.Domain.Shared;
using System.Text.Json.Serialization;

namespace DDDSample1.Domain.Incidents
{
    public class IncidentId : EntityId
    {
        [JsonConstructor]
        public IncidentId(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Incident ID cannot be empty.");
        }

        protected override object createFromString(string text)
        {
            return text;
        }

        public override string AsString() => Value;
    }
}
