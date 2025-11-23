using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.StaffMembers
{
    public interface IStaffMemberRepository : IRepository<StaffMember, StaffMemberId>
    {
        Task<StaffMember?> GetByMecanographicNumberAsync(MecanographicNumber mecNumber);
        
        // Sobreescribimos GetByIdAsync para asegurarnos de que cargue las cualificaciones
        new Task<StaffMember?> GetByIdAsync(StaffMemberId id);
    }
}