using Microsoft.EntityFrameworkCore;
using PortManagement.Models;

namespace PortManagement.Services
{
    public class DockService
    {
        private readonly PortManagementContext _context;

        public DockService(PortManagementContext context)
        {
        _context = context;
    }

    public async Task<Dock> AddDockAsync(DockCreateDto dto)
    {
        // Validate dto...

        var vesselTypes = await _context.VesselTypes
            .Where(v => dto.AllowedVesselTypeIds.Contains(v.Id))
            .ToListAsync();

        if (vesselTypes.Count != dto.AllowedVesselTypeIds.Count)
            throw new ArgumentException("Some vessel types do not exist.");

        var dock = new Dock(dto.DockName, dto.Location, dto.Depth, dto.Length, dto.MaxDraft)
        {
            AllowedVesselTypes = vesselTypes
        };

        _context.Docks.Add(dock);
        await _context.SaveChangesAsync();

        return dock;
    }


    // Update existing dock
    public async Task<Dock?> UpdateDockAsync(Guid id, DockUpdateDto dto)
    {
        var dock = await _context.Docks
            .Include(d => d.AllowedVesselTypes)
            .FirstOrDefaultAsync(d => d.ID == id);

        if (dock == null)
            return null;

        dock.UpdateDock(dto.Name, dto.Location, dto.Length, dto.Depth, dto.MaxDraft);

        if (dto.AllowedVesselTypeIds != null)
        {
            var vesselTypes = await _context.VesselTypes
            .Where(v => dto.AllowedVesselTypeIds.Contains(v.Id))
            .ToListAsync();

            if (vesselTypes.Count != dto.AllowedVesselTypeIds.Count)
            {
                var foundIds = vesselTypes.Select(v => v.Id).ToHashSet();
                var invalidIds = dto.AllowedVesselTypeIds.Where(id => !foundIds.Contains(id)).ToList();
                throw new ArgumentException($"Invalid vessel type IDs: {string.Join(", ", invalidIds)}");
            }

            dock.AllowedVesselTypes = vesselTypes;
        }

        await _context.SaveChangesAsync();
        return dock;
    }

        //???
        public async Task<List<Dock>> SearchDocksAsync(string? name, string? location, Guid? vesselTypeId)
        {
            var query = _context.Docks
                .Include(d => d.AllowedVesselTypes)
                .AsQueryable();

            if (!string.IsNullOrEmpty(name))
                query = query.Where(d => d.DockName.Contains(name));

            if (!string.IsNullOrEmpty(location))
                query = query.Where(d => d.Location.Contains(location));

            if (vesselTypeId.HasValue)
                query = query.Where(d => d.AllowedVesselTypes.Any(v => v.Id == vesselTypeId.Value));

            return await query.ToListAsync();
        }
    }
}
