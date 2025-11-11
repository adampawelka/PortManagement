using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Users
{
    public class UserRepository : BaseRepository<User, UserId>, IUserRepository
    {
        private readonly DDDSample1DbContext _context;

        public UserRepository(DDDSample1DbContext context) : base(context.Users)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetByIdAsync(UserId id)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User> GetByEmailAsync(UserEmail email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email.Value == email.Value);
        }

        public async Task<User> GetByIamUserIdAsync(string iamUserId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.IamUserId == iamUserId);
        }

        public async Task<User> GetByActivationTokenAsync(string token)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.ActivationToken == token);
        }

        public async Task<List<User>> GetByRoleAsync(UserRole role)
        {
            return await _context.Users
                .Where(u => u.Role.Value == role.Value)
                .ToListAsync();
        }

        public async Task<List<User>> GetByStatusAsync(UserStatus status)
        {
            return await _context.Users
                .Where(u => u.Status.Value == status.Value)
                .ToListAsync();
        }

        public async Task<List<User>> SearchByNameOrEmailAsync(string searchTerm)
        {
            var lowerSearchTerm = searchTerm.ToLowerInvariant();
            
            return await _context.Users
                .Where(u => u.Name.Value.ToLower().Contains(lowerSearchTerm) ||
                           u.Email.Value.ToLower().Contains(lowerSearchTerm))
                .ToListAsync();
        }

        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        public void Remove(User user)
        {
            _context.Users.Remove(user);
        }
    }
}