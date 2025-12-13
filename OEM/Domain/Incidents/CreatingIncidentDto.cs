using System;

namespace OEMAPI.Domain.Incidents
{
    public class CreatingIncidentDto
    {
        public Guid IncidentTypeId { get; set; }
        public DateTime StartTime { get; set; }
        public string Severity { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }

        public CreatingIncidentDto(
            Guid incidentTypeId,
            DateTime startTime,
            string severity,
            string description,
            string createdBy)
        {
            IncidentTypeId = incidentTypeId;
            StartTime = startTime;
            Severity = severity;
            Description = description;
            CreatedBy = createdBy;
        }
    }
}
