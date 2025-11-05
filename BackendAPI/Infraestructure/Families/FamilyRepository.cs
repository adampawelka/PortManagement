using Backend.Domain.Families;
using Backend.Infrastructure.Shared;

namespace Backend.Infrastructure.Families
{
    public class FamilyRepository : BaseRepository<Family, FamilyId>, IFamilyRepository
    {
      
        public FamilyRepository(DDDSample1DbContext context):base(context.Families)
        {
            
        }

    }
}