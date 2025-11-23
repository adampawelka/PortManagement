using Backend.Domain.Shared;

namespace Backend.Domain.StorageAreas
{
    public class Capacity : IValueObject
    {
        public int Value { get; private set; }

        private Capacity() { }

        public Capacity(int value)
        {
            if (value < 0)
                throw new BusinessRuleValidationException("Maximum capacity cannot be negative.");

            Value = value;
        }
    }

}
