using System;

namespace Backend.Domain.StorageAreas
{
    public class DockDistanceDto
    {
        public Guid DockId { get; set; }
        public string DockName { get; set; }
        public double Distance { get; set; }
    }

}