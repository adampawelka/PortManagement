using DDDSample1.Domain.Shared;
using System;
using System.Linq;

namespace DDDSample1.Domain.Resources
{
    public class AvailabilityStatus : IValueObject
    {
        public string Value { get; private set; }

        private AvailabilityStatus() { }

        public AvailabilityStatus(string value)
        {
            var valid = new[] { "active", "inactive", "maintenance" };
            if (!valid.Contains(value.ToLower()))
                throw new BusinessRuleValidationException("Invalid availability status.");

            Value = value;
        }
    }
}
