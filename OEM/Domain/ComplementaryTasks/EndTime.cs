
namespace OEMAPI.Domain.ComplementaryTasks


{
    public class EndTime : ValueObject
    {
        public DateTime? Value { get; }

        public EndTime(DateTime? value)
        {
            // EndTime may be null because the task can be ongoing
            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
