using System;

namespace DDDSample1.Domain.Vessels
{
    public class UpdatingVesselDto
    {
        public string? VesselName { get; set; }
        public string? OwnerId { get; set; }

        public UpdatingVesselDto() { }
    }
}
