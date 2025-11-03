using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ShippingAgents
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