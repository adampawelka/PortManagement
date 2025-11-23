using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend.Domain.Resources;
using Backend.Infrastructure.Shared;

namespace Backend.Infrastructure.Resources
{
    public class ResourceRepository : BaseRepository<Resource, ResourceId>, IResourceRepository
    {
        private readonly DDDSample1DbContext _context;

        public ResourceRepository(DDDSample1DbContext context) : base(context.Resources)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<Resource>> GetAllResourcesAsync()
        {
            return await _context.Resources.ToListAsync();
        }

        public async Task<Resource?> GetResourceByCodeAsync(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
                return null;

            return await _context.Resources
                .FirstOrDefaultAsync(r => r.Code.Value == code.Trim());
        }

        public async Task<List<Resource>> GetResourcesByDescriptionAsync(string description)
        {
            if (string.IsNullOrWhiteSpace(description))
                return new List<Resource>();

            return await _context.Resources
                .Where(r => EF.Functions.Like(r.Description.Value, $"%{description.Trim()}%"))
                .ToListAsync();
        }

        public async Task<List<Resource>> GetResourcesByTypeAsync(string type)
        {
            if (string.IsNullOrWhiteSpace(type))
                return new List<Resource>();

            return await _context.Resources
                .Where(r => r.Type.Value == type.Trim())
                .ToListAsync();
        }

        public async Task<List<Resource>> GetResourcesByStatusAsync(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
                return new List<Resource>();

            return await _context.Resources
                .Where(r => r.Status.Value == status.Trim())
                .ToListAsync();
        }

        public async Task<List<Resource>> SearchAsync(string? code, string? description, string? type, string? status)
        {
            var query = _context.Resources.AsQueryable();

            if (!string.IsNullOrWhiteSpace(code))
                query = query.Where(r => EF.Functions.Like(r.Code.Value, $"%{code.Trim()}%"));

            if (!string.IsNullOrWhiteSpace(description))
                query = query.Where(r => EF.Functions.Like(r.Description.Value, $"%{description.Trim()}%"));

            if (!string.IsNullOrWhiteSpace(type))
                query = query.Where(r => r.Type.Value == type.Trim());

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(r => r.Status.Value == status.Trim());

            return await query.ToListAsync();
        }

        public async Task<Resource> AddResourceAsync(Resource resource)
        {
            await _context.Resources.AddAsync(resource);
            await _context.SaveChangesAsync();
            return resource;
        }

        public async Task<Resource> UpdateResourceAsync(Resource resource)
        {
            var trackedEntity = _context.Resources.Local.FirstOrDefault(r => r.Id == resource.Id);
            if (trackedEntity == null)
            {
                _context.Resources.Attach(resource);
            }

            _context.Entry(resource).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return resource;
        }

        public async Task DeactivateResourceAsync(Resource resource)
        {
            // Cambia el estado a "Inactive" o el valor correspondiente
            resource.ChangeStatus(new AvailabilityStatus("Inactive"));
            _context.Resources.Update(resource);
            await _context.SaveChangesAsync();
        }

        public async Task ReactivateResourceAsync(Resource resource)
        {
            // Cambia el estado a "Active" o el valor correspondiente
            resource.ChangeStatus(new AvailabilityStatus("Active"));
            _context.Resources.Update(resource);
            await _context.SaveChangesAsync();
        }
    }
}
