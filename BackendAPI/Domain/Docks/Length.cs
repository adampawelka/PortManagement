using Backend.Domain.Shared;

namespace Backend.Domain.Docks
{
    public class Length : IValueObject
    {
        public double Value { get; }

        private Length() { }

        public Length(double value)
        {
           if (value <= 0) // upper limit?
                throw new BusinessRuleValidationException("Dock length must be greater than 0.");
            Value = value;
        }
    }
}