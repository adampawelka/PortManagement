using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.StaffMembers
{
    public class OperationalWindow : IValueObject
    {
        public string Value { get; private set; }

        public OperationalWindow(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Operational window cannot be empty.", nameof(value));

            var regex = new Regex(@"^([01]\d|2[0-3]):([0-5]\d)[–-]([01]\d|2[0-3]):([0-5]\d)$");

            if (!regex.IsMatch(value))
                throw new BusinessRuleValidationException("Operational window must be in format HH:mm–HH:mm.", nameof(value));

            Value = value;
        }

        protected IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
