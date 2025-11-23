using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.VesselVisitNotifications
{
    public class UpdatingVesselVisitNotificationDto
    {
        public Guid Id { get; set; }
        public DateTime ETA { get; set; }
        public DateTime ETD { get; set; }
        public List<CargoManifestDto> CargoManifests { get; set; }
        public List<CrewMemberDto> CrewMembers { get; set; }

        public UpdatingVesselVisitNotificationDto(
            Guid id,
            DateTime eta,
            DateTime etd,
            List<CargoManifestDto> cargoManifests,
            List<CrewMemberDto> crewMembers)
        {
            Id = id;
            ETA = eta;
            ETD = etd;
            CargoManifests = cargoManifests;
            CrewMembers = crewMembers;
        }
    }
}