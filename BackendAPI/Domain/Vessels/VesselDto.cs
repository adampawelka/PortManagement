using System;

namespace Backend.Domain.Vessels
{
    public class VesselDto
    {
        public Guid Id { get; set; }
        public string IMO { get; set; }
        public string VesselName { get; set; }
        public string OwnerId { get; set; }
        public Guid VesselTypeId { get; set; }
    }
}
