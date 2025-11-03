using System;
using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public class RepEmail : IValueObject
    {
        public string Value { get; private set; }

        private RepEmail()
        {
        }

        public RepEmail(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Email cannot be empty.");

            if (!value.Contains("@"))
                throw new BusinessRuleValidationException("Invalid email format.");

            Value = value;
        }
    }
}