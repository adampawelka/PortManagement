using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Incidents
{
    public class Incident : Entity<IncidentId>, IAggregateRoot
    {
        public IncidentTypeId IncidentTypeId { get; private set; }
        public StartTime StartTime { get; private set; }
        public EndTime EndTime { get; private set; }
        public Severity Severity { get; private set; }
        public Description Description { get; private set; }
        public CreatedBy CreatedBy { get; private set; }

        private Incident() { }

        public Incident(
            IncidentTypeId incidentTypeId, 
            StartTime startTime, 
            Severity severity,
            Description description,
            CreatedBy createdBy)
        {
            Id = new IncidentId(Guid.NewGuid().ToString());
            IncidentTypeId = incidentTypeId;
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
