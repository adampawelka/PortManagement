using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public class CitizenId : IValueObject
    {
        private CitizenId()
        {
        }
        public string Value { get; }

        public CitizenId(string value)
        {
            if (string.IsNullOrWhiteSpace(value) || value.Length > 20)
                throw new BusinessRuleValidationException("Citizen ID must be non-empty and up to 20 characters.");
            Value = value;
        }
    }
}