using DDDSample1.Domain.Shared;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace DDDSample1.Domain.VesselTypes
{
    public interface IVesselTypeRepository : IRepository<VesselType, VesselTypeId>
    {
        Task<List<VesselType>> GetByNameAsync(string name);
        Task<List<VesselType>> GetByDescriptionAsync(string description);
        Task<List<VesselType>> GetByCapacityRangeAsync(int minCapacity, int maxCapacity);
        Task<List<VesselType>> GetByConstraintsAsync(int maxRows, int maxBays, int maxTiers);
        Task<List<VesselType>> SearchAsync(string? name, string? description, int? minCapacity, int? maxCapacity);
        Task<VesselType> GetVesselTypeByIdAsync(VesselTypeId id);
        Task<List<VesselType>> GetAllVesselTypesAsync();
        Task<VesselType> AddVesselTypeAsync(VesselType vesselType);
    }
}
