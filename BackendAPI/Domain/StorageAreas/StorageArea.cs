using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.StorageAreas
{
    public class StorageArea : Entity<StorageAreaId>, IAggregateRoot
    {
        public StorageAreaType Type { get; private set; }
        public StorageAreaLocation Location { get; private set; }
        public Capacity MaxCapacity { get; private set; }
        public Occupancy CurrentOccupancy { get; private set; }
        public Dictionary<Guid, double> DockDistances { get; private set; }

        private StorageArea()
        {
            DockDistances = new Dictionary<Guid, double>();
        }

        public StorageArea(StorageAreaType type, StorageAreaLocation location, Capacity maxCapacity, Occupancy currentOccupancy)
        {
            this.Id = new StorageAreaId(Guid.NewGuid());
            this.Type = type ?? throw new BusinessRuleValidationException("Storage area type cannot be null.");
            this.Location = location ?? throw new BusinessRuleValidationException("Storage area location cannot be null.");
            this.MaxCapacity = maxCapacity ?? throw new BusinessRuleValidationException("Max capacity cannot be null.");
            this.CurrentOccupancy = currentOccupancy ?? throw new BusinessRuleValidationException("Current occupancy cannot be null.");
            this.DockDistances = new Dictionary<Guid, double>();

            if (currentOccupancy.Value > maxCapacity.Value)
                throw new BusinessRuleValidationException("Current occupancy cannot exceed maximum capacity.");
        }

        public void UpdateStorageArea(Capacity maxCapacity, Occupancy currentOccupancy)
        {
            if (currentOccupancy.Value > maxCapacity.Value)
                throw new BusinessRuleValidationException("Current occupancy cannot exceed maximum capacity.");

            this.MaxCapacity = maxCapacity ?? throw new BusinessRuleValidationException("Max capacity cannot be null.");
            this.CurrentOccupancy = currentOccupancy ?? throw new BusinessRuleValidationException("Current occupancy cannot be null.");
        }

        public void UpdateOccupancy(Occupancy newOccupancy)
        {
            if (newOccupancy == null)
                throw new BusinessRuleValidationException("Occupancy cannot be null.");

            if (newOccupancy.Value > MaxCapacity.Value)
                throw new BusinessRuleValidationException("Current occupancy cannot exceed maximum capacity.");

            this.CurrentOccupancy = newOccupancy;
        }

        public void SetDockDistances(Dictionary<Guid, double> dockDistances)
        {
            if (dockDistances == null)
                throw new BusinessRuleValidationException("Dock distances cannot be null.");

            this.DockDistances = new Dictionary<Guid, double>(dockDistances);
        }
    }
}