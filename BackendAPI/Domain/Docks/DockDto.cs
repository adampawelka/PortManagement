using System;
using System.Collections.Generic;
using DDDSample1.Domain.VesselTypes;

namespace DDDSample1.Domain.Docks
{
    public class DockDto
    {
        public Guid Id { get; set; }
        public string DockName { get; set; }
        public string DockLocation { get; set; }
        public double Depth { get; set; }
        public double Length { get; set; }
        public double MaxDraft { get; set; }

        public List<VesselTypeDto> AllowedVesselTypes { get; set; } = new();
    }
}
