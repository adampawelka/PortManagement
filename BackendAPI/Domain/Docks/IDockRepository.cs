using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Domain.Shared;

namespace Backend.Domain.Docks
{
    public interface IDockRepository : IRepository<Dock, DockId>
    {
        Task<List<Dock>> GetByNameAsync(string name);
        Task<List<Dock>> GetByLocationAsync(string location);
        Task<List<Dock>> GetByVesselTypeAsync(Guid vesselTypeId);
        Task<List<Dock>> SearchAsync(string? name, string? location, Guid? vesselTypeId);
        Task<List<Dock>> GetAllDocksAsync();
        Task<Dock> GetDockByIdAsync(DockId id);
        Task<Dock> AddDockAsync(Dock dock);
    }
}
