using System;

namespace Backend.Domain.Vessels
{
    public class UpdatingVesselDto
    {
        public string? VesselName { get; set; }
        public string? OwnerId { get; set; }

        public UpdatingVesselDto() { }
    }
}
