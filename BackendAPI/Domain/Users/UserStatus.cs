using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class UserStatus : IValueObject
    {
        public string Value { get; private set; }

        public static readonly UserStatus Active = new UserStatus("Active");
        public static readonly UserStatus Deactivated = new UserStatus("Deactivated");

        protected UserStatus()
        {
        }

        public UserStatus(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
                throw new BusinessRuleValidationException("Status cannot be empty.");

            status = status.Trim();

            if (!IsValidStatus(status))
                throw new BusinessRuleValidationException($"Invalid status: {status}");

            this.Value = status;
        }

        private bool IsValidStatus(string status)
        {
            return status == "Active" || status == "Deactivated";
        }

        public override bool Equals(object obj)
        {
            if (obj == null || obj.GetType() != typeof(UserStatus))
                return false;

            var other = (UserStatus)obj;
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

        public static implicit operator string(UserStatus status)
        {
            return status.Value;
        }
    }
}