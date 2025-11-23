using System;

namespace DDDSample1.Domain.Resources
{
    public class ResourceDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public double Capacity { get; set; }
        public string Status { get; set; }
        public int SetupTime { get; set; }
    }
}
