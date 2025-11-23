using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.StaffMembers
{
    public class MecanographicNumber : IValueObject
    {
        public string Value { get; private set; }

        public MecanographicNumber(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Mecanographic number cannot be empty.", nameof(value));
            
            Value = value;
        }

        protected IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}