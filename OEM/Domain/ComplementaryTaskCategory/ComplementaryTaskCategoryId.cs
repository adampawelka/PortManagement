using DDDSample1.Domain.Shared;
using System.Text.Json.Serialization;

namespace DDDSample1.Domain.ComplementaryTaskCategories
{
    public class ComplementaryTaskCategoryId : EntityId
    {
        [JsonConstructor]
        public ComplementaryTaskCategoryId(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Category ID cannot be empty.");
        }

        protected override object createFromString(string text)
        {
            return text;
        }

        public override string AsString() => Value;
    }
}
