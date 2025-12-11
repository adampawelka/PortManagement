using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ComplementaryTasks
{
    public class StartTime : ValueObject
    {
        public DateTime Value { get; }

        public StartTime(DateTime value)
        {
            if (value == default)
                throw new BusinessRuleValidationException("Start time cannot be default.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
