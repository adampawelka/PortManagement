using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.Docks
{
    public class CreatingDockDto
    {
        public string DockName { get; set; }
        public string DockLocation { get; set; }
        public double Depth { get; set; }
        public double Length { get; set; }
        public double MaxDraft { get; set; }

        public List<Guid> AllowedVesselTypes { get; set; } = new List<Guid>();

        public CreatingDockDto() { }
        public CreatingDockDto(string dockName, string dockLocation, double depth, double length, double maxDraft)
        {
            DockName = dockName;
            DockLocation = dockLocation;
            Depth = depth;
            Length = length;
            MaxDraft = maxDraft;
        }
    }
}

// // Controller receives CreateDockDto from API request
// var createDto = new CreateDockDto { DockName = "Main Dock", Location = "Harbor 1", ... };

// // Service validates and maps it to domain entity
// var dock = new Dock(createDto.DockName, createDto.Location, createDto.Depth, createDto.Length, createDto.MaxDraft);

// // Then persists the dock entity