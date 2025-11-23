using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Resources
{
    public class OperationalCapacity : IValueObject
    {
        public double Value { get; private set; }

        private OperationalCapacity() { }

        public OperationalCapacity(double value)
        {
            if (value < 0)
                throw new BusinessRuleValidationException("Operational capacity must be positive.");
            Value = value;
        }
    }
}
