using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend.Domain.Docks;
using Backend.Infrastructure.Shared;
using Backend.Domain.VesselTypes;

namespace Backend.Infrastructure.Docks
{
    public class DockRepository : BaseRepository<Dock, DockId>, IDockRepository
    {
        private readonly DDDSample1DbContext _context;

        public DockRepository(DDDSample1DbContext context) : base(context.Docks)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<Dock>> GetAllDocksAsync()
        {
            return await _context.Docks
            .Include(d => d.AllowedVesselTypes)
            .ToListAsync();
        }

        public async Task<Dock> GetDockByIdAsync(DockId id)
        {
            return await _context.Docks
            .Include(d => d.AllowedVesselTypes)
            .FirstOrDefaultAsync(d => d.Id == id);
        }


        public async Task<List<Dock>> GetByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return new List<Dock>();

            return await _context.Docks
                .Where(d => EF.Functions.Like(d.DockName.Value, $"%{name.Trim()}%"))
                .Include(d => d.AllowedVesselTypes)
                .ToListAsync();
        }

        public async Task<List<Dock>> GetByLocationAsync(string location)
        {
            if (string.IsNullOrWhiteSpace(location))
                return new List<Dock>();

            return await _context.Docks
                .Where(d => EF.Functions.Like(d.DockLocation.Value, $"%{location.Trim()}%"))
                .Include(d => d.AllowedVesselTypes)
                .ToListAsync();
        }

        public async Task<List<Dock>> GetByVesselTypeAsync(Guid vesselTypeId)
        {
            return await _context.Docks
                .Where(d => d.AllowedVesselTypes.Any(vt => vt.Id.AsGuid() == vesselTypeId))
                .Include(d => d.AllowedVesselTypes)
                .ToListAsync();
        }

        // Combine filters in one method
        public async Task<List<Dock>> SearchAsync(string? name, string? location, Guid? vesselTypeId)
        {
            var query = _context.Docks.AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(d => EF.Functions.Like(d.DockName.Value, $"%{name.Trim()}%"));

            if (!string.IsNullOrWhiteSpace(location))
                query = query.Where(d => EF.Functions.Like(d.DockLocation.Value, $"%{location.Trim()}%"));

            if (vesselTypeId.HasValue)
                query = query.Where(d => d.AllowedVesselTypes.Any(vt => vt.Id.AsGuid() == vesselTypeId.Value));

            return await query
                .Include(d => d.AllowedVesselTypes)
            .ToListAsync();
        }
        public async Task<Dock> AddDockAsync(Dock dock)
        {
            await _context.Docks.AddAsync(dock); // No return value
            await _context.SaveChangesAsync(); // Save the changes to the database
            
            return dock;
        }
        public async Task<Dock> UpdateVesselAsync(Dock dock)
        {
            var trackedEntity = _context.Docks.Local.FirstOrDefault(d => d.Id == dock.Id);
            if (trackedEntity == null)
            {
                _context.Docks.Attach(dock);
            }

            _context.Entry(dock).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return dock;
        }
        public async Task<Dock> DeleteDockAsync(Dock dock)
        {
            _context.Docks.Remove(dock);
            return dock;
        }
    }
}
