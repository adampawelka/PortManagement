using Backend.Domain.Shared;
using System.Text.RegularExpressions;

namespace Backend.Domain.Vessels
{
    public class IMO : IValueObject
    {
        private static readonly Regex ImoRegex = new(@"^\d{7}$");

        public string Value { get; }

        private IMO() { }

        public IMO(string value)
        {
            if (string.IsNullOrWhiteSpace(value) || !ImoRegex.IsMatch(value))
                throw new BusinessRuleValidationException("IMO number must consist of exactly 7 digits.");

            Value = value;
        }
    }
}
