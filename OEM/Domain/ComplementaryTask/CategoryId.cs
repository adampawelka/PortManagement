using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ComplementaryTasks
{
    public class CategoryId : ValueObject
    {
        public string Value { get; }

        public CategoryId(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Category ID cannot be empty.");
        
            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
