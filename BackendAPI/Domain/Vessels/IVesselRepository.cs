using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Vessels
{
    public interface IVesselRepository : IRepository<Vessel, VesselId>
    {
        Task<Vessel> GetVesselByIMOAsync(string imo);
        Task<List<Vessel>> GetVesselByTypeAsync(Guid vesselTypeId);

        // methods for name and operator searches:
        Task<List<Vessel>> GetVesselByNameAsync(string name);
        Task<List<Vessel>> GetVesselByOwnerAsync(Guid ownerId);
        Task<List<Vessel>> SearchAsync(string? imo, string? name, Guid? ownerId);

        Task<List<Vessel>> GetAllVesselsAsync();
        Task<Vessel> GetVesselByIdAsync(VesselId id);
        Task<Vessel> AddVesselAsync(Vessel vessel);
        Task<Vessel> UpdateVesselAsync(Vessel vessel);

    }
}
