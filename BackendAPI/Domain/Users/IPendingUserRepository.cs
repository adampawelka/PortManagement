using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public interface IPendingUserRepository : IRepository<PendingUser, PendingUserId>
    {
        Task<User> GetPendingUserByEmailAsync(UserEmail email);
        Task<User> GetPendingUserByIamUserIdAsync(string iamUserId);
        Task<List<User>> SearchByNameOrEmailAsync(string searchTerm);
        Task<User> GetPendingUserByIdAsync(UserId id);
        Task<List<User>> GetAllPendingUsersAsync();
    }
}