using System.ComponentModel.DataAnnotations;

namespace DDDSample1.Domain.VesselVisitNotifications
{
    public class RejectNotificationDto
    {
        [Required(ErrorMessage = "A reason for rejection must be provided.")]
        [StringLength(500, MinimumLength = 10, ErrorMessage = "The reason must be between 10 and 500 characters.")]
        public string Reason { get; set; }
    }
}