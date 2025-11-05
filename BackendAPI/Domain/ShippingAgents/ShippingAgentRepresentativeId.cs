using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public class ShippingAgentRepresentativeId : EntityId
    {
        public ShippingAgentRepresentativeId(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Representative ID must be non-empty.");
        }

        public override string AsString() => Value.ToString();

        protected override object createFromString(string text)
        {
            return text;
        }
    }
}