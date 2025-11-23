using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.StaffMembers
{
    public class StaffMemberId : EntityId
    {
        public StaffMemberId(string value) : base(ValidateAndReturn(value))
        {
        }

        private static string ValidateAndReturn(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Staff Member ID must be non-empty.");
            return value;
        }

        protected override object createFromString(string text)
        {
            return text; 
        }

        public override string AsString()
        {
            return Value?.ToString() ?? string.Empty;
        }

    }
}