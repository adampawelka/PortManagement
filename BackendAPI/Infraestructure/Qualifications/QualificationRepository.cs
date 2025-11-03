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
            return await _context.Qualifications.ToListAsync();
        }

        public async Task<Qualification?> GetQualificationByCodeAsync(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
                return null;

            return await _context.Qualifications
                .FirstOrDefaultAsync(q => q.Code.Value == code.Trim());
        }

        public async Task<List<Qualification>> GetQualificationsByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return new List<Qualification>();

            return await _context.Qualifications
                .Where(q => EF.Functions.Like(q.Name.Value, $"%{name.Trim()}%"))
                .ToListAsync();
        }

        public async Task<List<Qualification>> SearchAsync(string? code, string? name)
        {
            var query = _context.Qualifications.AsQueryable();

            if (!string.IsNullOrWhiteSpace(code))
                query = query.Where(q => EF.Functions.Like(q.Code.Value, $"%{code.Trim()}%"));

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(q => EF.Functions.Like(q.Name.Value, $"%{name.Trim()}%"));

            return await query.ToListAsync();
        }

        public async Task<Qualification> AddQualificationAsync(Qualification qualification)
        {
            await _context.Qualifications.AddAsync(qualification);
            await _context.SaveChangesAsync();
            return qualification;
        }

        public async Task<Qualification> UpdateQualificationAsync(Qualification qualification)
        {
            var trackedEntity = _context.Qualifications.Local.FirstOrDefault(q => q.Id == qualification.Id);
            if (trackedEntity == null)
            {
                _context.Qualifications.Attach(qualification);
            }

            _context.Entry(qualification).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return qualification;
        }

        public async Task<Qualification> GetByCodeAsync(string code)
        {
            var normalizedCode = code.ToUpperInvariant();
            
            return await _context.Qualifications.AsNoTracking().FirstOrDefaultAsync(q => q.Code.Value == normalizedCode);
        }
    }
}
