using DDDSample1.Domain.Shared;
using System;

namespace DDDSample1.Domain.Qualifications
{
    public class QualificationId : EntityId
    {
        public QualificationId() : base(Guid.NewGuid()) { }

        public QualificationId(Guid value) : base(value) { }

        protected override object createFromString(string text)
        {
            return new Guid(text);
        }
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
