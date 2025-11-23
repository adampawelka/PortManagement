using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Vessels
{
    public class VesselName : IValueObject
    {
        public string Value { get; }

        private VesselName() { }

        public VesselName(string value)
        {
            if (string.IsNullOrWhiteSpace(value) || value.Length > 100)
                throw new BusinessRuleValidationException("Vessel name must be non-empty and up to 100 characters.");
            Value = value;
        }
    }
}