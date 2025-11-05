using System;
using System.Collections.Generic;

namespace Backend.Domain.Docks
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
