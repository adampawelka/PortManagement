using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.StorageAreas
{
    public class DistanceToDock : IValueObject
    {
        public double Value { get; private set; }

        private DistanceToDock() { }

        public DistanceToDock(double value)
        {
            if (value < 0)
                throw new BusinessRuleValidationException("Distance cannot be negative.");
            Value = value;
        }
    }
}
