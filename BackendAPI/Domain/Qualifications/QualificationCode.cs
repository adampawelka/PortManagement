using Backend.Domain.Shared;

namespace Backend.Domain.Qualifications
{
    public class QualificationCode : IValueObject
    {
        public string Value { get; private set; }

        private QualificationCode() { }

        public QualificationCode(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Qualification code cannot be empty.");

            if (value.Length > 50)
                throw new BusinessRuleValidationException("Qualification code is too long.");

            Value = value;
        }
    }
}
