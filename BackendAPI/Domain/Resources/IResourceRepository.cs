using Backend.Domain.Shared;

namespace Backend.Domain.Resources
{
    public interface IResourceRepository : IRepository<Resource, ResourceId>
    {
    }
}
