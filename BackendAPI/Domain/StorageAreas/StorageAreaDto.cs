using System;
using System.Collections.Generic;

namespace Backend.Domain.StorageAreas
{
    public class StorageAreaDto
    {
        public Guid Id { get; set; }
        public string StorageAreaType { get; set; }
        public string StorageAreaLocation { get; set; }
        public int MaxCapacity { get; set; }
        public int CurrentOccupancy { get; set; }
        public List<DockDistanceDto> DockDistances { get; set; }
    }
}