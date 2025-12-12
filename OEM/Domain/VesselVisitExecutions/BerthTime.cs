namespace OEMAPI.Domain.VesselVisitExecutions
{
    public class BerthTime : ValueObject
    {
        public DateTime? Value { get; }

        public BerthTime(DateTime? value)
        {
            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
