using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public interface IShippingAgentORepository : IRepository<ShippingAgentOrganization, ShippingAgentOrganizationId>
    {
        Task<List<ShippingAgentOrganization>> GetAllAsync();
        Task<ShippingAgentOrganization> GetByIdAsync(ShippingAgentOrganizationId id);
        Task AddAsync(ShippingAgentOrganization organization);
        void Remove(ShippingAgentOrganization organization);
    }
}