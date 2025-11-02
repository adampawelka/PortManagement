using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Resources
{
    public class ResourceType : IValueObject
    {
        public string Value { get; private set; }

        private ResourceType() { }

        public ResourceType(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Resource type cannot be empty.");
            Value = value;
        }
    }
}
