using System;
using Backend.Domain.Shared;

namespace Backend.Domain.VesselTypes
{
    public class VesselType : Entity<VesselTypeId>, IAggregateRoot
    {
        public string Name { get; private set; }
        public string Description { get; private set; }
        public int Capacity { get; private set; }
        public OperationalConstraints Constraints { get; private set; }

        private VesselType()
        {
            // Private constructor for Entity Framework
        }

        public VesselType(string name, string description, int capacity, OperationalConstraints constraints)
        {
            if (string.IsNullOrEmpty(name))
                throw new BusinessRuleValidationException("Name is required.");
            if (string.IsNullOrEmpty(description))
                throw new BusinessRuleValidationException("Description is required.");
            if (capacity <= 0)
                throw new BusinessRuleValidationException("Capacity must be greater than 0.");
            if (constraints == null)
                throw new BusinessRuleValidationException("Constraints are required.");

            this.Id = new VesselTypeId(Guid.NewGuid());
            this.Name = name;
            this.Description = description;
            this.Capacity = capacity;
            this.Constraints = constraints;
        }

        public void ChangeName(string name)
        {
            if (string.IsNullOrEmpty(name))
                throw new BusinessRuleValidationException("Vessel type name cannot be empty.");
            this.Name = name;
        }

        public void ChangeDescription(string description)
        {
            if (string.IsNullOrEmpty(description))
                throw new BusinessRuleValidationException("Vessel type description cannot be empty.");
            this.Description = description;
        }

        public void ChangeCapacity(int capacity)
        {
            if (capacity <= 0)
                throw new BusinessRuleValidationException("Vessel type capacity must be positive.");
            this.Capacity = capacity;
        }

        public void ChangeConstraints(OperationalConstraints constraints)
        {
            if (constraints == null)
                throw new BusinessRuleValidationException("Vessel type must have operational constraints.");
            this.Constraints = constraints;
        }
    }
}