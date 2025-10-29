using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.StorageAreas;

public class StorageAreaExample
{
    public StorageAreaId Id { get; private set; }
    public string Type { get; private set; }
    public string Location { get; private set; }
    public int MaxCapacity { get; private set; }
    public int CurrentOccupancy { get; private set; }

    public Dictionary<Guid, double> DockDistances { get; private set; } = new();

    public StorageAreaExample(string type, string location, int maxCapacity, int currentOccupancy)
    {
        Type = type;
        Location = location;
        MaxCapacity = maxCapacity;
        CurrentOccupancy = currentOccupancy;
    }

    public void UpdateStorageArea(int maxCapacity, int currentOccupancy)
    {
        if (currentOccupancy > maxCapacity)
            throw new BusinessRuleValidationException("Current occupancy cannot exceed max capacity.");

        MaxCapacity = maxCapacity;
        CurrentOccupancy = currentOccupancy;
    }

    public void SetDockDistances(Dictionary<Guid, double> distances)
    {
        DockDistances = new Dictionary<Guid, double>(distances);
    }
}
