using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ShippingAgents
{
    public interface IShippingAgentORepository : IRepository<ShippingAgentOrganization, ShippingAgentOrganizationId>
    {
        Task<List<ShippingAgentOrganization>> GetAllAsync();
        Task<ShippingAgentOrganization> GetByIdAsync(ShippingAgentOrganizationId id);
        Task AddAsync(ShippingAgentOrganization organization);
        void Remove(ShippingAgentOrganization organization);
    }
}