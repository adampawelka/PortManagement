using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.StaffMembers;
using DDDSample1.Infrastructure.Shared;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

namespace DDDSample1.Infrastructure.StaffMembers
{
    public class StaffMemberRepository 
        : BaseRepository<StaffMember, StaffMemberId>, IStaffMemberRepository
    {
        private readonly DDDSample1DbContext _context;

        public StaffMemberRepository(DDDSample1DbContext context)
            : base(context.StaffMembers)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<StaffMember> GetByMecanographicNumberAsync(MecanographicNumber mecNumber)
        {
            return await _context.StaffMembers
                .FirstOrDefaultAsync(s => s.MecanographicNumber.Value == mecNumber.Value);
        }

        public async Task<StaffMember> GetByIdWithQualificationsAsync(StaffMemberId id)
        {
            return await _context.StaffMembers
                .Include(s => s.Qualifications)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<StaffMember>> GetAllStaffAsync()
        {
            return await _context.StaffMembers
                .Include(s => s.Qualifications)
                .ToListAsync();
        }
    }
}
