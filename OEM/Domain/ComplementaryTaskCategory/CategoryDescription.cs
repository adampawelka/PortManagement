using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ComplementaryTaskCategories
{
    public class CategoryDescription : ValueObject
    {
        public string Value { get; }

        public CategoryDescription(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Category description cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
