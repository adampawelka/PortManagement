using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ShippingAgents
{
    public class LegalName : IValueObject
    {
        public string Value { get; private set; }

        private LegalName()
        {
        }

        public LegalName(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Legal name cannot be empty.");

            Value = value;
        }
    }
}