using System;

namespace DDDSample1.Domain.VesselTypes
{
    public class VesselTypeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public OperationalConstraints Constraints { get; set; }

        public VesselTypeDto(Guid id, string name, string description, int capacity, OperationalConstraints constraints)
        {
            this.Id = id;
            this.Name = name;
            this.Description = description;
            this.Capacity = capacity;
            this.Constraints = constraints;
        }
    }
}
