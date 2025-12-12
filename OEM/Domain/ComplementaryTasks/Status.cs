
namespace OEMAPI.Domain.ComplementaryTasks
{
    public class Status : ValueObject
    {
        public string Value { get; }

        public Status(string value)
        {
            if (value != "ongoing" && value != "completed")
                throw new BusinessRuleValidationException("Invalid task status.");

            Value = value;
        }

        public static Status Ongoing() => new("ongoing");
        public static Status Completed() => new("completed");

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
