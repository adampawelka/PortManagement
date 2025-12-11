using DDDSample1.Domain.Shared;
using System.Text.Json.Serialization;

namespace DDDSample1.Domain.ComplementaryTasks
{
    public class ComplementaryTaskId : EntityId
    {
        [JsonConstructor]
        public ComplementaryTaskId(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Task ID cannot be empty.");
        }

        protected override object createFromString(string text)
        {
            return text;
        }

        public override string AsString() => Value;
    }
}
