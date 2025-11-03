using Backend.Domain.Shared;

namespace Backend.Domain.Resources
{
    public class ResourceDescription : IValueObject
    {
        public string Value { get; private set; }

        private ResourceDescription() { }

        public ResourceDescription(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Description cannot be empty.");
            Value = value;
        }
    }
}
