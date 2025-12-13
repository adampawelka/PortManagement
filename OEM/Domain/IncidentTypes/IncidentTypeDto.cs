using System;

namespace OEMAPI.Domain.IncidentTypes
{
    public class IncidentTypeDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Severity { get; set; }
    }
}
