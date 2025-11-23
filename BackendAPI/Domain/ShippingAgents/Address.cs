using System;
using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public class Address : IValueObject
    {
        public string Value { get; private set; }

        private Address()
        {
        }

        public Address(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Address cannot be empty.");

            Value = value;
        }
    }
}