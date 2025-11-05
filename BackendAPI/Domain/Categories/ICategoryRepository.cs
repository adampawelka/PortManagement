
using Backend.Domain.Shared;

namespace Backend.Domain.Categories
{
    public interface ICategoryRepository: IRepository<Category, CategoryId>
    {
    }
}