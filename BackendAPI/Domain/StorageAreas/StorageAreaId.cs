using System;
using Backend.Domain.Shared;

namespace Backend.Domain.StorageAreas
{
public class StorageAreaId : EntityId
    {
        public StorageAreaId() : base(Guid.NewGuid()) 
        { 
        }

        public StorageAreaId(Guid value) : base(value) 
        { 
        }

        public StorageAreaId(string value) : base(new Guid(value))
        {
        }

        protected override object createFromString(string text)
        {
            return new Guid(text);
        }

        public override string AsString()
        {
            return ((Guid)ObjValue).ToString();
        }

        public Guid AsGuid()
        {
            return (Guid)ObjValue;
        }

        public override bool Equals(object obj)
        {
            if (obj is StorageAreaId other)
            {
                return AsGuid().Equals(other.AsGuid());
            }
            return false;
        }

        public override int GetHashCode()
        {
            return AsGuid().GetHashCode();
        }
    }
}
