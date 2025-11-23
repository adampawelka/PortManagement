using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public interface IPendingUserRepository : IRepository<PendingUser, PendingUserId>
    {
        Task<PendingUser> GetPendingUserByEmailAsync(UserEmail email);
        Task<PendingUser> GetPendingUserByIamIdAsync(string iamUserId);
        Task<List<PendingUser>> SearchByNameOrEmailAsync(string searchTerm);
        Task<PendingUser> GetPendingUserByIdAsync(PendingUserId id);
        Task<List<PendingUser>> GetAllPendingUsersAsync();
        Task<PendingUser> AddPendingUserAsync(PendingUser pendingUser);
        Task RemovePendingUser(PendingUser pendingUser);
    }
}