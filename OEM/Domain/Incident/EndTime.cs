using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Incidents
{
    public class EndTime : ValueObject
    {
        public DateTime? Value { get; }

        public EndTime(DateTime? value)
        {
            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
