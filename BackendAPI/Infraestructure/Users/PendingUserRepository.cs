using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.PendingUsers;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.PendingUsers
{
    public class PendingUserRepository : BaseRepository<PendingUser, PendingUserId>, IPendingUserRepository
    {
        private readonly DDDSample1DbContext _context;

        public PendingUserRepository(DDDSample1DbContext context) : base(context.PendingUsers)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<PendingUser>> GetAllPendingUsersAsync()
        {
            return await _context.PendingUsers.ToListAsync();
        }

        public async Task<PendingUser> GetPendingUserByIdAsync(PendingUserId id)
        {
            return await _context.PendingUsers
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<PendingUser> GetPendingUserByEmailAsync(PendingUserEmail email)
        {
            return await _context.PendingUsers
                .FirstOrDefaultAsync(u => u.Email.Value == email.Value);
        }

        public async Task<PendingUser> GetPendingUserByIamIdAsync(string iamUserId)
        {
            return await _context.PendingUsers
                .FirstOrDefaultAsync(u => u.IamUserId == iamUserId);
        }


        public async Task<List<PendingUser>> SearchByNameOrEmailAsync(string searchTerm)
        {
            var lowerSearchTerm = searchTerm.ToLowerInvariant();
            
            return await _context.PendingUsers
                .Where(u => u.Name.Value.ToLower().Contains(lowerSearchTerm) ||
                           u.Email.Value.ToLower().Contains(lowerSearchTerm))
                .ToListAsync();
        }

        public async Task AddPendingUserAsync(PendingUser PendingUser)
        {
            await _context.PendingUsers.AddAsync(PendingUser);
        }

        public void RemovePendingUser(PendingUser PendingUser)
        {
            _context.PendingUsers.Remove(PendingUser);
        }
    }
}