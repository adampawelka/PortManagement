
namespace OEMAPI.Domain.ComplementaryTaskCategories
{
    public class CategoryCode : ValueObject
    {
        public string Value { get; }

        public CategoryCode(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Category code cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
