namespace OEMAPI.Domain.Incidents
{
    public class IncidentTypeId : EntityId
    {
        [JsonConstructor]
        public IncidentTypeId(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Incident Type ID cannot be empty.");
        }

        protected override object createFromString(string text)
        {
            return text;
        }

        public override string AsString() => Value;
    }
}
