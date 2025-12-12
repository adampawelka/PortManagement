
namespace OEMAPI.Domain.ComplementaryTaskCategories
{
    public class ComplementaryTaskCategory : Entity<ComplementaryTaskCategoryId>, IAggregateRoot
    {
        public CategoryCode Code { get; private set; }
        public CategoryName Name { get; private set; }
        public CategoryDescription Description { get; private set; }

        private ComplementaryTaskCategory() { }

        public ComplementaryTaskCategory(
            CategoryCode code,
            CategoryName name,
            CategoryDescription description)
        {
            Id = new ComplementaryTaskCategoryId(Guid.NewGuid().ToString());
            Code = code;
            Name = name;
            Description = description;
        }

        public void Update(CategoryCode code, CategoryName name, CategoryDescription description)
        {
            Code = code;
            Name = name;
            Description = description;
        }
    }
}
