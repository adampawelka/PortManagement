using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Qualifications
{
    public class QualificationName : IValueObject
    {
        public string Value { get; private set; }

        private QualificationName() { }

        public QualificationName(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Qualification name cannot be empty.");

            Value = value;
        }
    }
}
