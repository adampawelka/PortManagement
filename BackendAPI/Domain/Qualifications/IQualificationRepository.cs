using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Qualifications
{
    public interface IQualificationRepository : IRepository<Qualification, QualificationId>
    {
        Task<Qualification?> GetByCodeAsync(string code);
        Task<List<Qualification>> GetAllQualificationsAsync();
        Task<List<Qualification>> GetByNameAsync(string name);
        Task<List<Qualification>> SearchAsync(string? code, string? name);
        Task AddQualificationAsync(Qualification qualification);
        Task UpdateAsync(Qualification qualification);
    }
}
