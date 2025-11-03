using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.VesselVisitNotifications
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