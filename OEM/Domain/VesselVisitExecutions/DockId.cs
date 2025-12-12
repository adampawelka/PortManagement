namespace OEMAPI.Domain.VesselVisitExecutions
{
    public class DockId : ValueObject
    {
        public string Value { get; }

        public DockId(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Dock ID cannot be empty.");

            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
