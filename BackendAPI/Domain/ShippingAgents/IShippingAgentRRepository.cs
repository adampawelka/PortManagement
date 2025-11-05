using System.Threading.Tasks;
using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public interface IShippingAgentRRepository : IRepository<ShippingAgentRepresentative, ShippingAgentRepresentativeId>
    {
        Task<ShippingAgentRepresentative> GetByIdAsync(ShippingAgentRepresentativeId id);
        Task<ShippingAgentRepresentative> AddAsync(ShippingAgentRepresentative representative);
        Task UpdateAsync(ShippingAgentRepresentative representative);
        void Remove(ShippingAgentRepresentative representative);
    }
}