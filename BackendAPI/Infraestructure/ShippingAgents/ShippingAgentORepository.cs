using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.ShippingAgents;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.ShippingAgents
{
    public class ShippingAgentORepository : BaseRepository<ShippingAgentOrganization, ShippingAgentOrganizationId>, IShippingAgentORepository
    {
        private readonly DDDSample1DbContext _context;

        public ShippingAgentORepository(DDDSample1DbContext context) : base(context.ShippingAgentOrganizations)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<ShippingAgentOrganization>> GetAllAsync()
        {
            return await _context.ShippingAgentOrganizations
                .Include(o => o.Representatives)
                .ToListAsync();
        }

        public async Task<ShippingAgentOrganization> GetByIdAsync(ShippingAgentOrganizationId id)
        {
            return await _context.ShippingAgentOrganizations
                .Include(o => o.Representatives)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task AddAsync(ShippingAgentOrganization organization)
        {
            await _context.ShippingAgentOrganizations.AddAsync(organization);
        }

        public void Remove(ShippingAgentOrganization organization)
        {
            _context.ShippingAgentOrganizations.Remove(organization);
        }
    }
}