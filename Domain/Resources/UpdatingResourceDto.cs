namespace DDDSample1.Domain.Resources
{
    public class UpdatingResourceDto
    {
        public string Description { get; set; }
        public double Capacity { get; set; }
        public int SetupTime { get; set; }

        public UpdatingResourceDto(string description, double capacity, int setupTime)
        {
            Description = description;
            Capacity = capacity;
            SetupTime = setupTime;
        }
    }
}
