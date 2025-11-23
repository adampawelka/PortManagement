using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.VesselTypes;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.VesselTypes
{
    public class VesselTypeRepository : BaseRepository<VesselType, VesselTypeId>, IVesselTypeRepository
    {
        private readonly DDDSample1DbContext _context;

        public VesselTypeRepository(DDDSample1DbContext context) : base(context.VesselTypes)
        {
            _context = context;
        }

        public async Task<List<VesselType>> GetAllVesselTypesAsync()
        {
            return await _context.VesselTypes
                .ToListAsync();
        }
        public async Task<VesselType> GetVesselTypeByIdAsync(VesselTypeId id)
        {
            return await _context.VesselTypes
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<List<VesselType>> GetByNameAsync(string name)
        {
            return await _context.VesselTypes
                .Where(vt => vt.Name.Contains(name))
                .ToListAsync();
        }

        public async Task<List<VesselType>> GetByDescriptionAsync(string description)
        {
            return await _context.VesselTypes
                .Where(vt => vt.Description.Contains(description))
                .ToListAsync();
        }

        public async Task<List<VesselType>> GetByCapacityRangeAsync(int minCapacity, int maxCapacity)
        {
            return await _context.VesselTypes
                .Where(vt => vt.Capacity >= minCapacity && vt.Capacity <= maxCapacity)
                .ToListAsync();
        }

        public async Task<List<VesselType>> GetByConstraintsAsync(int maxRows, int maxBays, int maxTiers)
        {
            return await _context.VesselTypes
                .Where(vt => vt.Constraints.MaxRows == maxRows && 
                           vt.Constraints.MaxBays == maxBays && 
                           vt.Constraints.MaxTiers == maxTiers)
                .ToListAsync();
        }

        public async Task<List<VesselType>> SearchAsync(string? name, string? description, int? minCapacity, int? maxCapacity)
        {
            var query = _context.VesselTypes.AsQueryable();

            if (!string.IsNullOrEmpty(name))
                query = query.Where(vt => vt.Name.Contains(name));

            if (!string.IsNullOrEmpty(description))
                query = query.Where(vt => vt.Description.Contains(description));

            if (minCapacity.HasValue)
                query = query.Where(vt => vt.Capacity >= minCapacity.Value);

            if (maxCapacity.HasValue)
                query = query.Where(vt => vt.Capacity <= maxCapacity.Value);

            return await query.ToListAsync();
        }

        public async Task<VesselType> AddVesselTypeAsync(VesselType vesselType)
        {
            await _context.VesselTypes.AddAsync(vesselType);
            await _context.SaveChangesAsync();

            return vesselType;
        }
        public async Task<VesselType> UpdateVesselTypeAsync(VesselType vesselType)
        {
            // Attach the vessel if it is not being tracked
            var trackedEntity = _context.VesselTypes.Local.FirstOrDefault(v => v.Id == vesselType.Id);
            if (trackedEntity == null)
            {
                _context.VesselTypes.Attach(vesselType);
            }

            _context.Entry(vesselType).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return vesselType;
        }
    }
}