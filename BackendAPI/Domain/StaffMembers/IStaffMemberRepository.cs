using System.Threading.Tasks;
using Backend.Domain.Shared;

namespace Backend.Domain.StaffMembers
{
    public interface IStaffMemberRepository : IRepository<StaffMember, StaffMemberId>
    {
        Task<StaffMember?> GetByMecanographicNumberAsync(MecanographicNumber mecNumber);
        
        // Sobreescribimos GetByIdAsync para asegurarnos de que cargue las cualificaciones
        new Task<StaffMember?> GetByIdAsync(StaffMemberId id);
    }
}