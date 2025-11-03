using System;
using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public class RepPhone : IValueObject
    {
        public string Value { get; private set; }

        private RepPhone()
        {
        }

        public RepPhone(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Phone number cannot be empty.");

            Value = value;
        }
    }
}