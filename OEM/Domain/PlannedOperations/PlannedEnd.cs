namespace OEMAPI.Domain.PlannedOperations
{
    public class PlannedEnd : ValueObject
    {
        public DateTime Value { get; }

        public PlannedEnd(DateTime value)
        {
            if (value == default)
                throw new BusinessRuleValidationException("Planned end time cannot be default.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
