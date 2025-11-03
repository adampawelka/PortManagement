using DDDSample1.Domain.Shared;
using System;

namespace DDDSample1.Domain.Qualifications
{
    public class Qualification : Entity<QualificationId>, IAggregateRoot
    {
        public QualificationCode Code { get; private set; }
        public QualificationName Name { get; private set; }

        private Qualification() { }

        public Qualification(QualificationCode code, QualificationName name)
        {
            Id = new QualificationId(Guid.NewGuid());
            Code = code;
            Name = name;
        }

        public void Update(QualificationCode newCode, QualificationName newName)
        {
            Code = newCode;
            Name = newName;
        }
    }
}
