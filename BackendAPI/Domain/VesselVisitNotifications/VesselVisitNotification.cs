// NAMESPACE ESTANDARIZADO A DDDSample1
using System;
using System.Collections.Generic;
using Backend.Domain.Shared;
using Backend.Domain.Vessels;
using Backend.Domain.ShippingAgents;
using System.Linq;
using Backend.Domain.Docks; // <--- AÑADIDO DE 2.2.8   

namespace Backend.Domain.VesselVisitNotifications
{
    public class VesselVisitNotification : Entity<VesselVisitNotificationId>, IAggregateRoot
    {
    public VesselId VesselId { get; private set; }
    public ShippingAgentRepresentativeId SubmittedById { get; private set; }
    

    public virtual Vessel Vessel { get; private set; }
    public virtual ShippingAgentRepresentative SubmittedBy { get; private set; }
    
    public VisitStatus Status { get; private set; }
    public DateTime ETA { get; private set; }
    public DateTime ETD { get; private set; }
    public List<CargoManifest> CargoManifests { get; private set; }
    public List<CrewMember> CrewMembers { get; private set; }
    public DockId AssignedDockId { get; private set; }
    public string RejectionReason { get; private set; }
    public Guid? DecidingOfficerId { get; private set; }
    public DateTime? DecisionTimestamp { get; private set; }

    private VesselVisitNotification()
    {
    }


    public VesselVisitNotification(
        VesselId vesselId,
        ShippingAgentRepresentativeId submittedById,
        DateTime eta,
        DateTime etd,
        List<CargoManifest> cargoManifests,
        List<CrewMember> crewMembers)
    {
        if (vesselId == null)
            throw new BusinessRuleValidationException("Vessel ID is required.");
        if (submittedById == null)
            throw new BusinessRuleValidationException("Submitted by ID is required.");
        if (eta <= DateTime.Now)
            throw new BusinessRuleValidationException("ETA must be in the future.");
        if (etd < eta)
            throw new BusinessRuleValidationException("ETD must be after ETA.");
        if (cargoManifests == null || !cargoManifests.Any())
            throw new BusinessRuleValidationException("At least one cargo manifest is required.");

        Id = new VesselVisitNotificationId(Guid.NewGuid());
        VesselId = vesselId;
        SubmittedById = submittedById;
        Status = VisitStatus.InProgress();
        ETA = eta;
        ETD = etd;
        CargoManifests = cargoManifests;
        CrewMembers = crewMembers ?? new List<CrewMember>();
    }
    
 
        public void Submit()
        {
            if (Status.Value != "InProgress")
                throw new BusinessRuleValidationException("Only in progress notifications can be submitted.");
            
            // Validación de 2.2.11 (adaptada)
            if (this.CargoManifests == null || !this.CargoManifests.Any())
            {
                throw new InvalidOperationException("Cannot submit: Cargo manifest data is required.");
            }
            
            Status = VisitStatus.Submitted();
        }

        // --- Método de 2.2.9 (Update) ---
        // Hecho más robusto, como en el Service de 2.2.9
        public void UpdateVesselVisitNotification(
            DateTime eta,
            DateTime etd,
            List<CargoManifest> cargoManifests,
            List<CrewMember> crewMembers)
        {
             if (this.Status.Value != "InProgress")
            {
                throw new InvalidOperationException("Notification can only be modified while 'In Progress'.");
            }

            if (eta <= DateTime.Now)
                throw new BusinessRuleValidationException("ETA must be in the future.");
            if (etd < eta)
                throw new BusinessRuleValidationException("ETD must be after ETA.");
            if (cargoManifests == null || !cargoManifests.Any())
                throw new BusinessRuleValidationException("At least one cargo manifest is required.");

            this.ETA = eta;
            this.ETD = etd;
            this.CargoManifests = cargoManifests;
            this.CrewMembers = crewMembers ?? new List<CrewMember>();
        }


        // --- MÉTODO 'Approve' FUSIONADO ---
        // (Tomado de 2.2.8, adaptado a 2.2.9 'VisitStatus')
        public void Approve(DockId dockId, Guid officerId)
        {
            if (this.Status.Value != "Submitted")
            {
                throw new InvalidOperationException("Only 'Submitted' notifications can be approved.");
            }

            this.Status = VisitStatus.Approved(); // Adaptado
            this.AssignedDockId = dockId;
            this.RejectionReason = null; // Limpiar por si se había rechazado antes
            this.DecidingOfficerId = officerId;
            this.DecisionTimestamp = DateTime.UtcNow;
        }

        // --- MÉTODO 'Reject' FUSIONADO ---
        // (Tomado de 2.2.8, adaptado a 2.2.9 'VisitStatus')
        public void Reject(string reason, Guid officerId)
        {
            if (string.IsNullOrWhiteSpace(reason))
            {
                throw new ArgumentException("A valid reason is required for rejection.");
            }

            if (this.Status.Value != "Submitted")
            {
                throw new InvalidOperationException("Only 'Submitted' notifications can be rejected.");
            }

            this.Status = VisitStatus.Rejected(); // Adaptado
            this.RejectionReason = reason;
            this.AssignedDockId = null; // Limpiar por si se había aprobado antes
            this.DecidingOfficerId = officerId;
            this.DecisionTimestamp = DateTime.UtcNow;
        }
    }
}