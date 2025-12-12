namespace OEMAPI.Domain.OperationPlans
{
    public class ActualStart : ValueObject
    {
        public DateTime Value { get; }

        public ActualStart(DateTime value)
        {
            if (value == default)
                throw new BusinessRuleValidationException("Actual start time cannot be default.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
