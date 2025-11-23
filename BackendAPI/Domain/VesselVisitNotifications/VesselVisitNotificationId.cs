using System;
using Backend.Domain.Shared;
using Newtonsoft.Json;

namespace Backend.Domain.VesselVisitNotifications
{
    public class VesselVisitNotificationId : EntityId
    {
        [JsonConstructor]
        public VesselVisitNotificationId(Guid value) : base(value)
        {
        }

        public VesselVisitNotificationId(String value) : base(value)
        {
        }

        override 
        protected Object createFromString(String text) 
        {
            return new Guid(text);
        }

        override
        public String AsString()
        {
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }

        public Guid AsGuid()
        {
            return (Guid) base.ObjValue;
        }
    }
}