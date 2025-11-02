using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Qualifications;
using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.Resources
{
    public class Resource : Entity<ResourceId>, IAggregateRoot
    {
        public ResourceCode Code { get; private set; }
        public ResourceDescription Description { get; private set; }
        public ResourceType Type { get; private set; }
        public OperationalCapacity Capacity { get; private set; }
        public AvailabilityStatus Status { get; private set; }
        public SetupTime SetupTime { get; private set; }

      
        public List<QualificationId> RequiredQualifications { get; private set; } = new();

        private Resource() { }

        public Resource(ResourceCode code, ResourceDescription description, ResourceType type,
                        OperationalCapacity capacity, AvailabilityStatus status, SetupTime setupTime)
        {
            Id = new ResourceId(Guid.NewGuid());
            Code = code;
            Description = description;
            Type = type;
            Capacity = capacity;
            Status = status;
            SetupTime = setupTime;
        }

        public void Update(ResourceDescription newDescription, OperationalCapacity newCapacity, SetupTime newSetupTime)
        {
            Description = newDescription;
            Capacity = newCapacity;
            SetupTime = newSetupTime;
        }

        public void ChangeStatus(AvailabilityStatus newStatus)
        {
            Status = newStatus;
        }

        public void AssignQualification(QualificationId qualificationId)
        {
            if (!RequiredQualifications.Contains(qualificationId))
                RequiredQualifications.Add(qualificationId);
        }

        public void RemoveQualification(QualificationId qualificationId)
        {
            RequiredQualifications.Remove(qualificationId);
        }
    }
}
