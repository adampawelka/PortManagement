using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Docks
{
    public class DockLocation : IValueObject
    {
        public string Value { get; }

        private DockLocation() { }

        public DockLocation(string value)
        {
            if (string.IsNullOrWhiteSpace(value) || value.Length > 100)
                throw new BusinessRuleValidationException("Dock location must be non-empty and up to 100 characters.");
            Value = value;
        }
    }
}