using Backend.Domain.Shared;

namespace Backend.Domain.StorageAreas
{
    public class Occupancy : IValueObject
    {
        public int Value { get; private set; }

        private Occupancy() { }

        public Occupancy(int value)
        {
            if (value < 0)
                throw new BusinessRuleValidationException("Current occupancy cannot be negative.");

            Value = value;
        }
    }
}
