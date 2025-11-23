using System;
using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public class TaxNumber : IValueObject
    {
        public string Value { get; private set; }

        private TaxNumber()
        {
        }

        public TaxNumber(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Tax number cannot be empty.");

            // Optional: Add format validation
            // if (!System.Text.RegularExpressions.Regex.IsMatch(value, @"^[A-Z]{2}\d{9}$"))
            //     throw new BusinessRuleValidationException("Invalid tax number format.");

            Value = value;
        }
    }
}