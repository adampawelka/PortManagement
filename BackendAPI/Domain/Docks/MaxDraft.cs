using Backend.Domain.Shared;

namespace Backend.Domain.Docks
{
    public class MaxDraft : IValueObject
    {
        public double Value { get; }

        private MaxDraft() { }

        public MaxDraft(double value)
        {
           if (value <= 0) // upper limit?
                throw new BusinessRuleValidationException("Dock maximum draft must be greater than 0.");
            Value = value;
        }
    }
}