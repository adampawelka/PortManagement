using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class UserName : IValueObject
    {
        public string Value { get; private set; }

        protected UserName()
        {
        }

        public UserName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new BusinessRuleValidationException("Name cannot be empty.");

            name = name.Trim();

            if (name.Length < 2)
                throw new BusinessRuleValidationException("Name must have at least 2 characters.");

            if (name.Length > 200)
                throw new BusinessRuleValidationException("Name cannot exceed 200 characters.");

            this.Value = name;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || obj.GetType() != typeof(UserName))
                return false;

            var other = (UserName)obj;
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

        public static implicit operator string(UserName name)
        {
            return name.Value;
        }
    }
}