using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.Docks
{
    public class UpdatingDockDto 
    {       
        public string? DockName { get; set; }
        public string? DockLocation { get; set; }
        public double? Length { get; set; }
        public double? Depth { get; set; }
        public double? MaxDraft { get; set; }
        public UpdatingDockDto() { }
    }
}
