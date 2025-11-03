using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.VesselTypes;
using DDDSample1.Domain.ShippingAgents;

namespace DDDSample1.Domain.Vessels
{
    public class Vessel : Entity<VesselId>, IAggregateRoot
    {
        public IMO IMO { get; private set; }
        public VesselName VesselName { get; private set; }
        public VesselType VesselType { get; private set; }
        public ShippingAgentOrganization Owner { get; private set; } 

        private Vessel() { } // EF Core needs this

        public Vessel(
            IMO imo, 
            VesselName vesselName, 
            VesselType vesselType, 
            ShippingAgentOrganization owner)
        {

            Id = new VesselId(Guid.NewGuid());
            IMO = imo;
            VesselName = vesselName;
            VesselType = vesselType;
            Owner = owner;
        }
    
        public void UpdatingVessel(VesselName? vesselName, ShippingAgentOrganization? owner)
        {
            if (vesselName != null)
                VesselName = vesselName;

            if (owner != null)
                Owner = owner;
        }
    }
}
