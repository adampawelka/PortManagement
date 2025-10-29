using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DDDSample1.Domain.StorageAreas
{
    public class UpdateStorageAreaDto
    {
        [Required]
        public string StorageAreaType { get; set; }

        [Required]
        public string StorageAreaLocation { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Max capacity must be non-negative.")]
        public int MaxCapacity { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Current occupancy must be non-negative.")]
        public int CurrentOccupancy { get; set; }

        public List<DockDistanceInput> DockDistances { get; set; }
    }
}