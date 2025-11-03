using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Vessels;
using DDDSample1.Infrastructure.Shared;
//using DDDSample1.Domain.VesselTypes;

namespace DDDSample1.Infrastructure.Vessels
{
    public class VesselRepository : BaseRepository<Vessel, VesselId>, IVesselRepository
    {
        private readonly DDDSample1DbContext _context;

        public VesselRepository(DDDSample1DbContext context) : base(context.Vessels)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<Vessel>> GetAllVesselsAsync()
        {
            return await _context.Vessels
                .Include(v => v.VesselType)
                .Include(v => v.Owner)
                .ToListAsync();
        }

        public async Task<List<Vessel>> GetVesselByTypeAsync(Guid vesselTypeId)
        {
        return await _context.Vessels
            .Where(v => v.VesselType.Id.AsGuid() == vesselTypeId)
            .Include(v => v.VesselType)
            .Include(v => v.Owner)
            .ToListAsync();
        }


        public async Task<Vessel> GetVesselByIdAsync(VesselId id)
        {
            return await _context.Vessels
                .Include(v => v.VesselType)
                .Include(v => v.Owner)
                .FirstOrDefaultAsync(v => v.Id == id);
        }
        public async Task<Vessel> GetVesselByIMOAsync(string imo)
        {
            if (string.IsNullOrWhiteSpace(imo))
                return null;

            return await _context.Vessels
                .Include(v => v.VesselType)
                .Include(v => v.Owner)
                .FirstOrDefaultAsync(v => v.IMO.Value == imo.Trim());
        }

        public async Task<List<Vessel>> GetVesselByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return new List<Vessel>();

            return await _context.Vessels
                .Where(v => EF.Functions.Like(v.VesselName.Value, $"%{name.Trim()}%"))
                .Include(v => v.VesselType)
                .Include(v => v.Owner)
                .ToListAsync();
        }

        public async Task<List<Vessel>> GetVesselByOwnerAsync(Guid ownerId)
        {
            return await _context.Vessels
                .Where(v => EF.Property<Guid>(v, "OwnerId") == ownerId)
                .Include(v => v.VesselType)
                .Include(v => v.Owner)
                .ToListAsync();
        }

        public async Task<List<Vessel>> SearchAsync(string? imo, string? name, Guid? ownerId)
        {
            var query = _context.Vessels.AsQueryable();

            if (!string.IsNullOrWhiteSpace(imo))
                query = query.Where(v => EF.Functions.Like(v.IMO.Value, $"%{imo.Trim()}%"));

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(v => EF.Functions.Like(v.VesselName.Value, $"%{name.Trim()}%"));

            if (ownerId.HasValue)
            {
                query = query.Where(v => EF.Property<Guid>(v, "OwnerId") == ownerId.Value);
            }


            return await query
                .Include(v => v.VesselType)
                .Include(v => v.Owner)
                .ToListAsync();
        }

        public async Task<Vessel> AddVesselAsync(Vessel vessel)
        {
            await _context.Vessels.AddAsync(vessel);
            await _context.SaveChangesAsync();

            return vessel;
        }
        public async Task<Vessel> UpdateVesselAsync(Vessel vessel)
        {
            // Attach the vessel if it is not being tracked
            var trackedEntity = _context.Vessels.Local.FirstOrDefault(v => v.Id == vessel.Id);
            if (trackedEntity == null)
            {
                _context.Vessels.Attach(vessel);
            }

            _context.Entry(vessel).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return vessel;
        }
    }
}
