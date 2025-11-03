using System;
using System.Collections.Generic;

namespace Backend.Domain.VesselVisitNotifications
{
    public class CreatingVesselVisitNotificationDto
        {
        public Guid VesselId { get; set; }
        public Guid SubmittedById { get; set; }
        public DateTime ETA { get; set; }
        public DateTime ETD { get; set; }
        public List<CargoManifestDto> CargoManifests { get; set; }
        public List<CrewMemberDto> CrewMembers { get; set; }

        public CreatingVesselVisitNotificationDto(
            Guid vesselId,
            Guid submittedById,
            DateTime eta,
            DateTime etd,
            List<CargoManifestDto> cargoManifests,
            List<CrewMemberDto> crewMembers)
        {
            VesselId = vesselId;
            SubmittedById = submittedById;
            ETA = eta;
            ETD = etd;
            CargoManifests = cargoManifests;
            CrewMembers = crewMembers;
        }
    }
}