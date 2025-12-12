namespace OEMAPI.Domain.PlannedOperations
{
    public class PlannedStart : ValueObject
    {
        public DateTime Value { get; }

        public PlannedStart(DateTime value)
        {
            if (value == default)
                throw new BusinessRuleValidationException("Planned start time cannot be default.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
