using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ShippingAgents
{
    public class ShippingAgentRepresentativeId : EntityId
    {
        public ShippingAgentRepresentativeId(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Representative ID must be non-empty.");
        }

        public override string AsString() => ObjValue.ToString();
        public Guid AsGuid()
        {
            if (ObjValue is Guid guid)
                return guid;
            return Guid.Parse(ObjValue.ToString());
        }

        protected override object createFromString(string text)
        {
            return Guid.Parse(text);
        }
    }
}