using System;
using DDDSample1.Domain.Shared;
using Newtonsoft.Json;

namespace DDDSample1.Domain.Users
{
    public class PendingUserId : EntityId
    {
        [JsonConstructor]
        public PendingUserId(Guid value) : base(value)
        {
        }

        public PendingUserId(string value) : base(value)
        {
        }

        override
        protected object createFromString(string text)
        {
            return new Guid(text);
        }

        override
        public string AsString()
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