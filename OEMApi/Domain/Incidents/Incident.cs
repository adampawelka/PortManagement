using System;

namespace OEMApi.Domain.Incidents
{
    public class Incident
    {
        public string Id { get; private set; }
        public string Description { get; private set; }
        public string Severity { get; private set; } // e.g., "Critical", "Major"
        public string CreatorUserId { get; private set; }
        public DateTime StartTime { get; private set; }

        public Incident(string description, string severity, string creatorId)
        {
            Id = Guid.NewGuid().ToString();
            Description = description;
            Severity = severity;
            CreatorUserId = creatorId;
            StartTime = DateTime.UtcNow;
        }
    }
}