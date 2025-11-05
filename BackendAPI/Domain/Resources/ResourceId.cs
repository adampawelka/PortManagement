using Backend.Domain.Shared;
using System;

namespace Backend.Domain.Resources
{
    public class ResourceId : EntityId
    {
        public ResourceId() : base(Guid.NewGuid()) { }
        public ResourceId(Guid value) : base(value) { }

        protected override object createFromString(string text) => new Guid(text);
        public override string AsString()
        {
            Guid obj = (Guid)base.ObjValue;
            return obj.ToString();
        }

        public Guid AsGuid()
        {
            return (Guid)base.ObjValue;
        }
    }
}
