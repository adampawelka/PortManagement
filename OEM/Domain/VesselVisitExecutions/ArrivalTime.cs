namespace OEMAPI.Domain.VesselVisitExecutions
{
    public class ArrivalTime : ValueObject
    {
        public DateTime Value { get; }

        public ArrivalTime(DateTime value)
        {
            if (value == default)
                throw new BusinessRuleValidationException("Arrival time cannot be default.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
