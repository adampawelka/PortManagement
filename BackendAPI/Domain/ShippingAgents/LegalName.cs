using System;
using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
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