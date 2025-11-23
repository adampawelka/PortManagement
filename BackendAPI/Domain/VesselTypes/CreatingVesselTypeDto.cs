using DDDSample1.Domain.VesselTypes;

namespace DDDSample1.Domain.VesselTypes
{
    public class CreatingVesselTypeDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public OperationalConstraints Constraints { get; set; }

        public CreatingVesselTypeDto(string name, string description, int capacity, OperationalConstraints constraints)
        {
            this.Name = name;
            this.Description = description;
            this.Capacity = capacity;
            this.Constraints = constraints;
        }
    }
}
