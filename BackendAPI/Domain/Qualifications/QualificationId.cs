using DDDSample1.Domain.Shared;
using System;
using System.Text.Json.Serialization;

namespace DDDSample1.Domain.Qualifications
{
    public class QualificationId : EntityId
    {
        [JsonConstructor]
        public QualificationId(Guid value) : base(value.ToString()) { }

        public QualificationId(string value) : base(ValidateAndReturn(value))
        {
            Value = value;  // Set the property
        }

        // Expose Value as a public property for mapping
        public string Value { get; private set; }

        private static string ValidateAndReturn(string value)
        {
            if (string.IsNullOrWhiteSpace(value)) throw new BusinessRuleValidationException("Qualification ID must be non-empty.");
            return value;
        }

        protected override object createFromString(string text)
        {
            return text; 
        }

        public override string AsString()
        {
            return Value?.ToString() ?? string.Empty;
        }
    }
}