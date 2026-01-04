using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OEMAPI.Domain.VesselVisitExecutions;
using OEMAPI.Domain.Shared;
using OEMAPI.Infrastructure.Shared;

namespace OEMAPI.Infrastructure.VesselVisitExecutions
{
    public class VesselVisitExecutionRepository 
        : BaseRepository<VesselVisitExecution, VesselVisitExecutionId>, 
          IVesselVisitExecutionRepository
    {
        private readonly OEMAPIDbContext _context;

        public VesselVisitExecutionRepository(OEMAPIDbContext context)
            : base(context.VesselVisitExecutions)
        {
            _context = context;
        }

        public async Task<List<VesselVisitExecution>> GetAllAsync()
        {
            return await _context.VesselVisitExecutions
                .Include(vve => vve.VvnId)
                .Include(vve => vve.DockId)
                .Include(vve => vve.CreatedBy)
                .ToListAsync();
        }

        public async Task<VesselVisitExecution> GetByIdAsync(VesselVisitExecutionId id)
        {
            return await _context.VesselVisitExecutions
                .Include(vve => vve.VvnId)
                .Include(vve => vve.DockId)
                .Include(vve => vve.CreatedBy)
                .FirstOrDefaultAsync(vve => vve.Id == id);
        }

        public async Task<List<VesselVisitExecution>> GetByVvnIdAsync(Guid vvnId)
        {
            return await _context.VesselVisitExecutions
                .Where(vve => vve.VvnId.AsGuid() == vvnId)
                .Include(vve => vve.DockId)
                .Include(vve => vve.CreatedBy)
                .ToListAsync();
        }

        public async Task<List<VesselVisitExecution>> GetByStatusAsync(string status)
        {
            return await _context.VesselVisitExecutions
                .Where(vve => vve.Status.Value == status)
                .Include(vve => vve.DockId)
                .Include(vve => vve.CreatedBy)
                .ToListAsync();
        }

        public async Task<List<VesselVisitExecution>> GetByCreatedByAsync(Guid createdById)
        {
            var createdByIdString = createdById.ToString();

            return await _context.VesselVisitExecutions
                .Where(vve => vve.CreatedBy.Id.AsString() == createdByIdString)
                .Include(vve => vve.DockId)
                .ToListAsync();
        }

        public async Task<VesselVisitExecution> AddAsync(VesselVisitExecution vesselVisitExecution)
        {
            await _context.VesselVisitExecutions.AddAsync(vesselVisitExecution);
            await _context.SaveChangesAsync();
            return vesselVisitExecution;
        }
    }
}
