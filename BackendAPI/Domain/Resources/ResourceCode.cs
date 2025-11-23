using Backend.Domain.Shared;

namespace Backend.Domain.Resources
{
    public class ResourceCode : IValueObject
    {
        public string Value { get; private set; }

        private ResourceCode() { }

        public ResourceCode(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Resource code cannot be empty.");
            Value = value;
        }
    }
}
