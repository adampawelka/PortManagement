using System;
using System.Collections.Generic;
using Backend.Domain.Shared;
using Backend.Domain.VesselTypes; 

namespace Backend.Domain.Docks
{
    public class Dock : Entity<DockId>, IAggregateRoot
    {
        public DockName DockName { get; private set; }
        public DockLocation DockLocation { get; private set; }
        public Depth Depth { get; private set; }
        public Length Length { get; private set; }
        public MaxDraft MaxDraft { get; private set; }

        public List<VesselType> AllowedVesselTypes { get; private set; } = new();

        private Dock() { } // EF Core może teraz utworzyć instancję

        public Dock(
            DockName dockName, 
            DockLocation dockLocation, 
            Depth depth, 
            Length length, 
            MaxDraft maxDraft)
        {

            Id = new DockId(Guid.NewGuid());
            DockName = dockName ?? throw new BusinessRuleValidationException("Dock name is required.");
            DockLocation = dockLocation ?? throw new BusinessRuleValidationException("Dock location is required.");
            Depth = depth ?? throw new BusinessRuleValidationException("Dock depth is required.");
            Length = length ?? throw new BusinessRuleValidationException("Dock length is required.");
            MaxDraft = maxDraft ?? throw new BusinessRuleValidationException("Dock maximum draft is required.");

            AllowedVesselTypes = new List<VesselType>(); // ← initialize it here!
        }

        public void UpdateDock(
            DockName? dockName, 
            DockLocation? dockLocation, 
            Depth? depth, 
            Length? length, 
            MaxDraft? maxDraft)
        {
            if (dockName != null)
                DockName = dockName;

            if (dockLocation != null)
                DockLocation = dockLocation;

            if (depth != null)
                Depth = depth;

            if (length != null)
                Length = length;

            if (maxDraft != null)
                MaxDraft = maxDraft;
        }


        public void AllowVesselType(VesselType vesselType) // checking for the duplicates
        {
            if (!this.AllowedVesselTypes.Contains(vesselType))
                this.AllowedVesselTypes.Add(vesselType);
        }

    }
}
