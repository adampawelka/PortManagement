using System;

namespace DDDSample1.Domain.Vessels
{
    public class CreatingVesselDto
    {
        public string IMO { get; set; }
        public string VesselName { get; set; }
        public Guid VesselTypeId { get; set; }
        public Guid OwnerId { get; set; }

        public CreatingVesselDto() { }

        public CreatingVesselDto(string imo, string vesselName, Guid vesselTypeId, Guid ownerId)
        {
            IMO = imo;
            VesselName = vesselName;
            VesselTypeId = vesselTypeId;
            OwnerId = ownerId;
        }
    }
}
