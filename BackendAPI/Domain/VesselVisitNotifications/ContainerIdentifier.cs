using DDDSample1.Domain.Shared;
using System.Text.RegularExpressions;

namespace DDDSample1.Domain.VesselVisitNotifications
{
    public class ContainerIdentifier : IValueObject
    {
        private static readonly Regex Iso6346Regex = new(@"^[A-Z]{4}\d{7}$");

        public string Value { get; private set; }

        private ContainerIdentifier()
        {
        }

        public ContainerIdentifier(string value)
        {
            if (string.IsNullOrEmpty(value))
                throw new BusinessRuleValidationException("Container identifier cannot be empty.");
            if (!IsValidIso6346(value))
                throw new BusinessRuleValidationException($"Invalid container identifier: {value}");

            Value = value;
        }

        private bool IsValidIso6346(string value)
        {
            return Iso6346Regex.IsMatch(value);
        }
    }
}