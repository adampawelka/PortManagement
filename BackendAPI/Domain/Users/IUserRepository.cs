using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public interface IUserRepository : IRepository<User, UserId>
    {
        Task<User> GetByEmailAsync(UserEmail email);
        Task<User> GetByIamUserIdAsync(string iamUserId);
        Task<User> GetByActivationTokenAsync(string token);
        Task<List<User>> GetByRoleAsync(UserRole role);
        Task<List<User>> GetByStatusAsync(UserStatus status);
        Task<List<User>> SearchByNameOrEmailAsync(string searchTerm);
        Task<User> GetUserByIdAsync(UserId id);

        Task<List<User>> GetAllUsersAsync();
    }
}