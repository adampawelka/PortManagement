using Backend.Domain.Shared;

namespace Backend.Domain.Products
{
    public interface IProductRepository: IRepository<Product,ProductId>
    {
    }
}