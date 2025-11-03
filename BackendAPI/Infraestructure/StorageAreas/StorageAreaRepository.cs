using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.StorageAreas;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.StorageAreas
{
    public class StorageAreaRepository : BaseRepository<StorageArea, StorageAreaId>, IStorageAreaRepository
    {
        private readonly DbSet<StorageArea> _storageAreas;

        public StorageAreaRepository(DDDSample1DbContext context) : base(context.StorageAreas)
        {
            _storageAreas = context.Set<StorageArea>();
        }

        public async Task<List<StorageArea>> GetAllAsync()
        {
            return await _storageAreas
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<StorageArea> GetByIdAsync(StorageAreaId id)
        {
            return await _storageAreas
                .AsNoTracking()
                .FirstOrDefaultAsync(sa => sa.Id == id);
        }

        public async Task<StorageArea> AddAsync(StorageArea storageArea)
        {
            await _storageAreas.AddAsync(storageArea);
            return storageArea;
        }

        public void Remove(StorageArea storageArea)
        {
            _storageAreas.Remove(storageArea);
        }

        public async Task<List<StorageArea>> GetByTypeAsync(string type)
        {
            if (string.IsNullOrWhiteSpace(type))
                return new List<StorageArea>();

            return await _storageAreas
                .AsNoTracking()
                .Where(sa => sa.Type.Value.ToLower() == type.ToLower())
                .ToListAsync();
        }

        public async Task<List<StorageArea>> GetByDockIdAsync(Guid dockId)
        {
            var allStorageAreas = await _storageAreas
                .AsNoTracking()
                .ToListAsync();

            return allStorageAreas
                .Where(sa => sa.DockDistances.ContainsKey(dockId))
                .ToList();
        }

        public async Task<List<StorageArea>> GetAvailableStorageAreasAsync()
        {
            return await _storageAreas
                .AsNoTracking()
                .Where(sa => sa.CurrentOccupancy.Value < sa.MaxCapacity.Value)
                .ToListAsync();
        }

        public async Task<List<StorageArea>> SearchByLocationAsync(string location)
        {
            if (string.IsNullOrWhiteSpace(location))
                return await GetAllAsync();

            return await _storageAreas
                .AsNoTracking()
                .Where(sa => sa.Location.Value.Contains(location))
                .ToListAsync();
        }
    }
}
