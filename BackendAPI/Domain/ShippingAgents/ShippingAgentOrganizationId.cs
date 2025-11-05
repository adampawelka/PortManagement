using System;
using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public class ShippingAgentOrganizationId : EntityId
    {
        public ShippingAgentOrganizationId(string value) : base(ValidateAndReturn(value))
        {
        }

        private static string ValidateAndReturn(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Organization ID must be non-empty.");
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