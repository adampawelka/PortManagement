using Backend.Domain.Products;
using Backend.Infrastructure.Shared;

namespace Backend.Infrastructure.Products
{
    public class ProductRepository : BaseRepository<Product, ProductId>,IProductRepository
    {
        public ProductRepository(DDDSample1DbContext context):base(context.Products)
        {
           
        }
    }
}