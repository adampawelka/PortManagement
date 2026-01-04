using DDDSample1.Domain.Shared;
using System;
using System.Text.Json.Serialization;

namespace DDDSample1.Domain.Qualifications
{
    public class QualificationId : EntityId
    {
        [JsonConstructor]
        public QualificationId(Guid value) : base(value) { }

        public QualificationId(string value) : base(value) { }

        protected override object createFromString(string text)
        {
            return new Guid(text);
        }

        public override string AsString()
        {
            return ((Guid)base.ObjValue).ToString();
        }

        public Guid AsGuid()
        {
            return (Guid)base.ObjValue;
        }
    }
}
