

namespace OEMAPI.Domain.ComplementaryTasks
{
    public class ResponsibleTeam : ValueObject
    {
        public string Value { get; }

        public ResponsibleTeam(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Responsible team cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
