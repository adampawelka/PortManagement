using System;

namespace OEMAPI.Domain.Incidents
{
    public class IncidentDto
    {
        public Guid Id { get; set; }
        public Guid IncidentTypeId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Severity { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }
    }
}
