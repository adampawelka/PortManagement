using System;

namespace DDDSample1.Domain.StorageAreas
{
    public class DockDistanceDto
    {
        public Guid DockId { get; set; }
        public string DockName { get; set; }
        public double Distance { get; set; }
    }

}