
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class UserEmail : IValueObject
    {
        public string Value { get; private set; }

        private const string EmailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

        protected UserEmail()
        {
        }

        public UserEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new BusinessRuleValidationException("Email cannot be empty.");

            email = email.Trim().ToLowerInvariant();

            if (!Regex.IsMatch(email, EmailPattern))
                throw new BusinessRuleValidationException("Invalid email format.");

            if (email.Length > 255)
                throw new BusinessRuleValidationException("Email cannot exceed 255 characters.");

            this.Value = email;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || obj.GetType() != typeof(UserEmail))
                return false;

            var other = (UserEmail)obj;
            return this.Value == other.Value;
        }

        public override int GetHashCode()
        {
            return Value.GetHashCode();
        }

        public override string ToString()
        {
            return Value;
        }

        public static implicit operator string(UserEmail email)
        {
            return email.Value;
        }
    }
}