using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Resources
{
    public interface IResourceRepository : IRepository<Resource, ResourceId>
    {
    }
}
