namespace OEMAPI.Domain.VesselVisitExecutions
{
    public class Status : ValueObject
    {
        public string Value { get; }

        public Status(string value)
        {
            if (value != "InProgress" && value != "Completed")
                throw new BusinessRuleValidationException("Invalid status.");

            Value = value;
        }

        public static Status InProgress() => new("InProgress");
        public static Status Completed() => new("Completed");

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
