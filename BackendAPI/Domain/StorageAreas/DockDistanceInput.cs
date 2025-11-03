using System;
using System.ComponentModel.DataAnnotations;

namespace DDDSample1.Domain.StorageAreas
{
    public class DockDistanceInput
    {
        [Required]
        public Guid DockId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Distance must be greater than zero.")]
        public double Distance { get; set; }
    }
}