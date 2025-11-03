using Backend.Domain.Shared;

namespace Backend.Domain.StorageAreas
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
