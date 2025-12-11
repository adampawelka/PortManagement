using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OEMApi.Domain.Incidents;
using OEMApi.Infrastructure.Database;

namespace OEMApi.Infrastructure.Repositories
{
    public class IncidentRepository : IIncidentRepository
    {
        private readonly OEMDbContext _context;

        public IncidentRepository(OEMDbContext context)
        {
            _context = context;
        }

        public async Task<Incident> AddAsync(Incident incident)
        {
            await _context.Incidents.AddAsync(incident);
            await _context.SaveChangesAsync();
            return incident;
        }

        public async Task<List<Incident>> GetAllAsync()
        {
            return await _context.Incidents.ToListAsync();
        }

        public async Task<Incident?> GetByIdAsync(string id)
        {
            return await _context.Incidents.FindAsync(id);
        }
    }
}