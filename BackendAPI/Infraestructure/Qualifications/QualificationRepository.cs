using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Qualifications;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Qualifications
{
    public class QualificationRepository : BaseRepository<Qualification, QualificationId>, IQualificationRepository
    {
        private readonly DDDSample1DbContext _context;

        public QualificationRepository(DDDSample1DbContext context) : base(context.Qualifications)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<Qualification>> GetAllQualificationsAsync()
        {
            return await _context.Qualifications.AsNoTracking().ToListAsync();
        }

        public async Task<Qualification?> GetByCodeAsync(string code)
        {
            if (string.IsNullOrWhiteSpace(code)) return null;

            var normalizedCode = code.Trim().ToUpperInvariant();

            // Pobieramy wszystko do pamięci i filtrujemy po ValueObject
            return (await _context.Qualifications.AsNoTracking().ToListAsync())
                   .FirstOrDefault(q => q.Code.Value == normalizedCode);
        }

        public async Task<List<Qualification>> GetByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return new List<Qualification>();

            var trimmedName = name.Trim();

            // Filtrujemy w pamięci po ValueObject
            return (await _context.Qualifications.AsNoTracking().ToListAsync())
                   .Where(q => q.Name.Value.Contains(trimmedName, StringComparison.OrdinalIgnoreCase))
                   .ToList();
        }

        public async Task<List<Qualification>> SearchAsync(string? code, string? name)
        {
            var qualifications = await _context.Qualifications.AsNoTracking().ToListAsync();

            if (!string.IsNullOrWhiteSpace(code))
            {
                var trimmedCode = code.Trim().ToUpperInvariant();
                qualifications = qualifications
                                 .Where(q => q.Code.Value.Contains(trimmedCode))
                                 .ToList();
            }

            if (!string.IsNullOrWhiteSpace(name))
            {
                var trimmedName = name.Trim();
                qualifications = qualifications
                                 .Where(q => q.Name.Value.Contains(trimmedName, StringComparison.OrdinalIgnoreCase))
                                 .ToList();
            }

            return qualifications;
        }

        public async Task AddQualificationAsync(Qualification qualification)
        {
            if (qualification == null) throw new ArgumentNullException(nameof(qualification));

            await _context.Qualifications.AddAsync(qualification);
        }

        public async Task UpdateAsync(Qualification qualification)
        {
            var trackedEntity = _context.Qualifications.Local.FirstOrDefault(q => q.Id == qualification.Id);
            if (trackedEntity == null)
            {
                _context.Qualifications.Attach(qualification);
            }

            _context.Entry(qualification).State = EntityState.Modified;
        }
    }
}
