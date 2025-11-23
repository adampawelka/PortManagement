using System.Threading.Tasks;

namespace Backend.Domain.Shared
{
    public interface IUnitOfWork
    {
        Task<int> CommitAsync();
    }
}