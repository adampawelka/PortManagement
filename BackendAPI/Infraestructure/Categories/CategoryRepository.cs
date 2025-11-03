using Backend.Domain.Categories;
using Backend.Infrastructure.Shared;

namespace Backend.Infrastructure.Categories
{
    public class CategoryRepository : BaseRepository<Category, CategoryId>, ICategoryRepository
    {
    
        public CategoryRepository(DDDSample1DbContext context):base(context.Categories)
        {
           
        }


    }
}