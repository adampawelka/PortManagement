using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.StorageAreas
{
    public class StorageAreaType : IValueObject
    {
        public string Value { get; private set; }

        private StorageAreaType() { }

        public StorageAreaType(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Storage area type cannot be empty.");

            var normalizedValue = value.Trim();
            if (!normalizedValue.Equals("Warehouse", System.StringComparison.OrdinalIgnoreCase) &&
                !normalizedValue.Equals("Yard", System.StringComparison.OrdinalIgnoreCase))
                throw new BusinessRuleValidationException($"Invalid storage area type '{value}'. Must be 'Warehouse' or 'Yard'.");

            Value = normalizedValue;
        }
    }
}
