using System;

namespace DDDSample1.Domain.Resources
{
    public class CreatingResourceDto
    {
        public string Code { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public double Capacity { get; set; }
        public string Status { get; set; }
        public int SetupTime { get; set; }

        public CreatingResourceDto(string code, string description, string type, double capacity, string status, int setupTime)
        {
            Code = code;
            Description = description;
            Type = type;
            Capacity = capacity;
            Status = status;
            SetupTime = setupTime;
        }
    }
}
