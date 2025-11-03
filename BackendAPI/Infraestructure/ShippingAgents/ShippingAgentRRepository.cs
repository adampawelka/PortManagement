using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.ShippingAgents;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.ShippingAgents
{
    public class ShippingAgentRRepository : IShippingAgentRRepository
    {
        private readonly DDDSample1DbContext _context;

        public ShippingAgentRRepository(DDDSample1DbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<ShippingAgentRepresentative>> GetAllAsync()
        {
            return await _context.ShippingAgentRepresentatives.ToListAsync();
        }

        public async Task<List<ShippingAgentRepresentative>> GetByIdsAsync(List<ShippingAgentRepresentativeId> ids)
        {
            return await _context.ShippingAgentRepresentatives
                .Where(r => ids.Contains(r.Id))
                .ToListAsync();
        }

        public async Task<ShippingAgentRepresentative> GetByIdAsync(ShippingAgentRepresentativeId id)
        {
            return await _context.ShippingAgentRepresentatives.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);
        }


         public async Task<ShippingAgentRepresentative> AddAsync(ShippingAgentRepresentative representative)
        {
            var entry = await _context.ShippingAgentRepresentatives.AddAsync(representative);
            return entry.Entity;
        }

        public async Task UpdateAsync(ShippingAgentRepresentative representative)
        {

            var existingEntry = _context.ChangeTracker.Entries<ShippingAgentRepresentative>().FirstOrDefault(e => e.Entity.Id == representative.Id);
            
            if (existingEntry != null)
            {
                _context.Entry(existingEntry.Entity).State = EntityState.Detached;
            }

            _context.ShippingAgentRepresentatives.Update(representative);
        }

        public void Remove(ShippingAgentRepresentative representative)
        {
            _context.ShippingAgentRepresentatives.Remove(representative);
        }
    }
}