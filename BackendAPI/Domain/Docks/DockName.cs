using Backend.Domain.Shared;

namespace Backend.Domain.Docks
{
    public class DockName : IValueObject
    {
        public string Value { get; }

        private DockName() { }

        public DockName(string value)
        {
            if (string.IsNullOrWhiteSpace(value) || value.Length > 100)
                throw new BusinessRuleValidationException("Dock name must be non-empty and up to 100 characters.");
            Value = value;
        }
    }
}