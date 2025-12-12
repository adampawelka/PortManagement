namespace OEMAPI.Domain.OperatorPlans
{
    public class CreatedAt : ValueObject
    {
        public DateTime Value { get; }

        public CreatedAt(DateTime value)
        {
            if (value == default)
                throw new BusinessRuleValidationException("CreatedAt cannot be default.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
