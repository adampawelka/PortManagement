using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend.Domain.VesselVisitNotifications;
using Backend.Domain.Shared;
using Backend.Infrastructure.Shared;

namespace Backend.Infrastructure.VesselVisitNotifications
{
    public class VesselVisitNotificationRepository : BaseRepository<VesselVisitNotification, VesselVisitNotificationId>, IVesselVisitNotificationRepository
    {
        private readonly DDDSample1DbContext _context;

        public VesselVisitNotificationRepository(DDDSample1DbContext context) : base(context.VesselVisitNotifications)
        {
            this._context = context;
        }

        public async Task<List<VesselVisitNotification>> GetAllNotificationsAsync()
        {
        return await _context.VesselVisitNotifications
        .Include(vvn => vvn.Vessel)
        .Include(vvn => vvn.SubmittedBy)
        .ToListAsync();
        }

        public async Task<VesselVisitNotification> GetNotificationByIdAsync(VesselVisitNotificationId id)
        {
        return await _context.VesselVisitNotifications
        .Include(vvn => vvn.Vessel)
        .Include(vvn => vvn.SubmittedBy)
        .FirstOrDefaultAsync(vvn => vvn.Id == id);
        }


        public async Task<List<VesselVisitNotification>> GetNotificationByVesselIdAsync(Guid vesselId)
        {
            return await _context.VesselVisitNotifications
                .Where(vvn => vvn.Vessel.Id.AsGuid() == vesselId)
                .Include(vvn => vvn.Vessel)
                .Include(vvn => vvn.SubmittedBy)
                .ToListAsync();
        }

        public async Task<List<VesselVisitNotification>> GetByStatusAsync(string status)
        {
            return await _context.VesselVisitNotifications
                .Where(vvn => vvn.Status.Value == status)
                .Include(vvn => vvn.Vessel)
                .Include(vvn => vvn.SubmittedBy)
                .ToListAsync();
        }

        public async Task<List<VesselVisitNotification>> GetBySubmittedByIdAsync(Guid submittedById)
        {
        
            var submittedByIdString = submittedById.ToString();
            
            return await _context.VesselVisitNotifications
                .Where(vvn => vvn.SubmittedBy.Id.AsString() == submittedByIdString)
                .Include(vvn => vvn.Vessel)
                .Include(vvn => vvn.SubmittedBy)
                .ToListAsync();
        }


        public async Task<VesselVisitNotification> AddVesselVisitNotificationAsync(VesselVisitNotification vesselVisitNotification)
        {
            await _context.VesselVisitNotifications.AddAsync(vesselVisitNotification);

            await _context.SaveChangesAsync();

            return vesselVisitNotification;
        }
    }
}