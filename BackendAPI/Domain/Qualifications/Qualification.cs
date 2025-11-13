using Backend.Domain.Shared;
using System;

namespace Backend.Domain.Qualifications
{
    public class Qualification : Entity<QualificationId>, IAggregateRoot
    {
        public QualificationCode Code { get; private set; }
        public QualificationName Name { get; private set; }

        private Qualification() { }

        public Qualification(QualificationCode code, QualificationName name)
        {
            Id = new QualificationId(Guid.NewGuid().ToString());
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
