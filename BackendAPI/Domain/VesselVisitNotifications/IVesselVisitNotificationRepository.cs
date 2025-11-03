using Backend.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Domain.Shared;

namespace Backend.Domain.VesselVisitNotifications
{
    public interface IVesselVisitNotificationRepository : IRepository<VesselVisitNotification, VesselVisitNotificationId>
    {
        Task<List<VesselVisitNotification>> GetNotificationByVesselIdAsync(Guid vesselId);
        Task<List<VesselVisitNotification>> GetByStatusAsync(string status);
        Task<List<VesselVisitNotification>> GetBySubmittedByIdAsync(Guid submittedById);
        Task<List<VesselVisitNotification>> GetAllNotificationsAsync();
        Task<VesselVisitNotification> GetNotificationByIdAsync(VesselVisitNotificationId id);

        Task<VesselVisitNotification> AddVesselVisitNotificationAsync(VesselVisitNotification vesselVisitNotification);
    }
}