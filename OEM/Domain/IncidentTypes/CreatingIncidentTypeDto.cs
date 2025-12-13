using System;

namespace OEMAPI.Domain.IncidentTypes
{
    public class CreatingIncidentTypeDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Severity { get; set; }

        public CreatingIncidentTypeDto(
            string code,
            string name,
            string description,
            string severity)
        {
            Code = code;
            Name = name;
            Description = description;
            Severity = severity;
        }
    }
}
