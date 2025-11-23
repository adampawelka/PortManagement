using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Docks
{
    public class Depth : IValueObject
    {
        public double Value { get; }

        private Depth() { }

        public Depth(double value)
        {
           if (value <= 0) // upper limit?
                throw new BusinessRuleValidationException("Dock depth must be greater than 0.");
            Value = value;
        }
    }
}