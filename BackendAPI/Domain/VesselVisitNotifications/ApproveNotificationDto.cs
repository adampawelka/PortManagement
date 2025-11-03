using System;
using System.ComponentModel.DataAnnotations;

namespace DDDSample1.Domain.VesselVisitNotifications
{
    public class ApproveNotificationDto
    {
        [Required(ErrorMessage = "A Dock ID must be assigned for approval.")]
        public Guid DockId { get; set; }
    }
}