using Backend.Domain.Shared;

namespace Backend.Domain.Resources
{
    public class SetupTime : IValueObject
    {
        public int Value { get; private set; }

        private SetupTime() { }

        public SetupTime(int value)
        {
            if (value < 0)
                throw new BusinessRuleValidationException("Setup time cannot be negative.");
            Value = value;
        }
    }
}
