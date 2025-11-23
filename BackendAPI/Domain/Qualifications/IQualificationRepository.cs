using System.Threading.Tasks;
using Backend.Domain.Shared;

namespace Backend.Domain.Qualifications
{
    public interface IQualificationRepository : IRepository<Qualification, QualificationId>
    {
        Task<Qualification> GetByCodeAsync(string code);
    }
}
