using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public class AlternativeName : IValueObject
    {
        private AlternativeName()
        {
        }
        public string Value { get; }

        public AlternativeName(string value)
        {
            if (value != null && (value.Length == 0 || value.Length > 50))
                throw new BusinessRuleValidationException("Alternative name must be up to 50 characters if provided.");
            Value = value;
        }
    }
}