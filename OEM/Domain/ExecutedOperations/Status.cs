namespace OEMAPI.Domain.ExecutedOperations
{
    public class Status : ValueObject
    {
        public string Value { get; }

        public Status(string value)
        {
            if (value != "started" && value != "completed" && value != "delayed")
                throw new BusinessRuleValidationException("Invalid status value.");

            Value = value;
        }

        public static Status Started() => new("started");
        public static Status Completed() => new("completed");
        public static Status Delayed() => new("delayed");

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
