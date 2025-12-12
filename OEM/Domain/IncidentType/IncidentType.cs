namespace OEMAPI.Domain.Incidents
{
    public class IncidentType : Entity<IncidentTypeId>, IAggregateRoot
    {
        public IncidentTypeCode Code { get; private set; }
        public IncidentTypeName Name { get; private set; }
        public IncidentTypeDescription Description { get; private set; }
        public IncidentTypeSeverity Severity { get; private set; }

        private IncidentType() { }

        public IncidentType(
            IncidentTypeCode code,
            IncidentTypeName name,
            IncidentTypeDescription description,
            IncidentTypeSeverity severity)
        {
            Id = new IncidentTypeId(Guid.NewGuid().ToString());
            Code = code;
            Name = name;
            Description = description;
            Severity = severity;
        }

        public void Update(
            IncidentTypeCode newCode, 
            IncidentTypeName newName, 
            IncidentTypeDescription newDescription,
            IncidentTypeSeverity newSeverity)
        {
            Code = newCode;
            Name = newName;
            Description = newDescription;
            Severity = newSeverity;
        }
    }
}
