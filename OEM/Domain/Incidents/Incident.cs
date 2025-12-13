using OEMAPI.Domain.IncidentTypes;

namespace OEMAPI.Domain.Incidents
{
    public class Incident : Entity<IncidentId>, IAggregateRoot
    {
        public IncidentType IncidentType { get; private set; }
        public StartTime StartTime { get; private set; }
        public EndTime EndTime { get; private set; }
        public Severity Severity { get; private set; }
        public Description Description { get; private set; }
        public CreatedBy CreatedBy { get; private set; }

        private Incident() { }

        public Incident(
            IncidentType incidentType, 
            StartTime startTime, 
            Severity severity,
            Description description,
            CreatedBy createdBy)
        {
            Id = new IncidentId(Guid.NewGuid().ToString());
            IncidentType = incidentType;
            StartTime = startTime;
            Severity = severity;
            Description = description;
            CreatedBy = createdBy;
            EndTime = new EndTime(null); // active incident
        }

        public void Resolve(EndTime endTime)
        {
            if (endTime.Value < StartTime.Value)
                throw new BusinessRuleValidationException("End time cannot be before start time.");

            EndTime = endTime;
        }
    }
}
