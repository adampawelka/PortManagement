using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.StorageAreas
{
    public interface IStorageAreaRepository : IRepository<StorageArea, StorageAreaId>
    {
        Task<List<StorageArea>> GetAllAsync();
        Task<StorageArea> GetByIdAsync(StorageAreaId id);
        Task<StorageArea> AddAsync(StorageArea storageArea);
        void Remove(StorageArea storageArea);
        Task<List<StorageArea>> GetByTypeAsync(string type);
        Task<List<StorageArea>> GetByDockIdAsync(Guid dockId);
        Task<List<StorageArea>> GetAvailableStorageAreasAsync();
        Task<List<StorageArea>> SearchByLocationAsync(string location);
    }
}
