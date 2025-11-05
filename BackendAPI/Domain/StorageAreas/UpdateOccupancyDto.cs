using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.StorageAreas
{
    public class UpdateOccupancyDto
    {
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Current occupancy must be non-negative.")]
        public int CurrentOccupancy { get; set; }
    }
}