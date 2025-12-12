namespace OEMAPI.Domain.VesselVisitExecutions
{
    public class CreatedBy : ValueObject
    {
        public string Value { get; }

        public CreatedBy(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("CreatedBy cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
