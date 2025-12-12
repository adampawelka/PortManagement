namespace OEMAPI.Domain.ExecutedOperations
{
    public class ActualEnd : ValueObject
    {
        public DateTime? Value { get; }

        public ActualEnd(DateTime? value)
        {
            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
