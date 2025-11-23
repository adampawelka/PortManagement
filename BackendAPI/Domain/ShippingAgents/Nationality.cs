using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public class Nationality : IValueObject
    {
        private Nationality()
        {
        }
        public string Value { get; }

        public Nationality(string value)
        {
            if (string.IsNullOrWhiteSpace(value) || value.Length > 50)
                throw new BusinessRuleValidationException("Nationality must be non-empty and up to 50 characters.");
            Value = value;
        }
    }
}