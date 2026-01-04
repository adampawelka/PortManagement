using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.VesselVisitNotifications
{
    public class VesselVisitNotificationDto
    {
        public Guid Id { get; set; }
        public Guid VesselId { get; set; }
        public string VesselName { get; set; }
        public string VesselIMO { get; set; }
        public Guid SubmittedById { get; set; }
        public string SubmittedByName { get; set; }
        public string Status { get; set; }
        public DateTime ETA { get; set; }
        public DateTime ETD { get; set; }
        public List<CargoManifestDto> CargoManifests { get; set; }
        public List<CrewMemberDto> CrewMembers { get; set; }

        public Guid? AssignedDockId { get; set; }
        public string RejectionReason { get; set; }
        public Guid? DecidingOfficerId { get; set; }
        public DateTime? DecisionTimestamp { get; set; }

        public VesselVisitNotificationDto(
            Guid id,
            Guid vesselId,
            string vesselName,
            string vesselIMO,
            Guid submittedById,
            string submittedByName,
            string status,
            DateTime eta,
            DateTime etd,
            List<CargoManifestDto> cargoManifests,
            List<CrewMemberDto> crewMembers,
            Guid? assignedDockId,   
            string rejectionReason,    
            Guid? decidingOfficerId,  
            DateTime? decisionTimestamp 
            )
        {
            Id = id;
            VesselId = vesselId;
            VesselName = vesselName;
            VesselIMO = vesselIMO;
            SubmittedById = submittedById;
            SubmittedByName = submittedByName;
            Status = status;
            ETA = eta;
            ETD = etd;
            CargoManifests = cargoManifests;
            CrewMembers = crewMembers;

            AssignedDockId = assignedDockId;
            RejectionReason = rejectionReason;
            DecidingOfficerId = decidingOfficerId;
            DecisionTimestamp = decisionTimestamp;
        }
    }
}