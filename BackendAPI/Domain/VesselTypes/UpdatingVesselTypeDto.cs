using System;

namespace Backend.Domain.VesselTypes
{
    public class UpdatingVesselTypeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public OperationalConstraints Constraints { get; set; }

        public UpdatingVesselTypeDto(Guid id, string name, string description, int capacity, OperationalConstraints constraints)
        {
            this.Id = id;
            this.Name = name;
            this.Description = description;
            this.Capacity = capacity;
            this.Constraints = constraints;
        }
    }
}
