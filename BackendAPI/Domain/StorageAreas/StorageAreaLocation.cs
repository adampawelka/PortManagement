using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.StorageAreas
{
    public class StorageAreaLocation : IValueObject
    {
        public string Value { get; private set; }

        private StorageAreaLocation() { }

        public StorageAreaLocation(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Storage area location cannot be empty.");

            Value = value.Trim();
        }
    }

}
