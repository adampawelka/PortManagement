
namespace OEMAPI.Domain.ComplementaryTaskCategories
{
    public class CategoryName : ValueObject
    {
        public string Value { get; }

        public CategoryName(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Category name cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
