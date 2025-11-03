using System;

namespace DDDSample1.Domain.Qualifications
{
    public class QualificationDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        public QualificationDto(Guid id, string code, string name)
        {
            Id = id;
            Code = code;
            Name = name;
        }
    }
}
