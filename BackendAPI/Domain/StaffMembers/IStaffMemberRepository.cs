using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using System.Collections.Generic;

namespace DDDSample1.Domain.StaffMembers
{
    public interface IStaffMemberRepository : IRepository<StaffMember, StaffMemberId>
    {
        Task<StaffMember> GetByMecanographicNumberAsync(MecanographicNumber mecNumber);

        Task<StaffMember> GetByIdWithQualificationsAsync(StaffMemberId id);

        Task<List<StaffMember>> GetAllStaffAsync();
    }
}
