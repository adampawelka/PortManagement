using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public class RepName : IValueObject
    {
        public string Value { get; }
        private RepName()
        {
        }
        public RepName(string value)
        {
            if (string.IsNullOrWhiteSpace(value) || value.Length > 100)
                throw new BusinessRuleValidationException("Name must be non-empty and up to 100 characters.");
            Value = value;
        }
    }
}