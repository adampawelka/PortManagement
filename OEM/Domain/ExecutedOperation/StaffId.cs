namespace OEMAPI.Domain.OperationPlans
{
    public class StaffId : ValueObject
    {
        public string Value { get; }

        public StaffId(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Staff ID cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
