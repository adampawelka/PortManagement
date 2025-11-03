using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.StorageAreas
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
