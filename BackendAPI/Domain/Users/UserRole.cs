using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class UserRole : IValueObject
    {
        public string Value { get; private set; }
        public static readonly UserRole None = new UserRole("None");
        public static readonly UserRole Administrator = new UserRole("Administrator");
        public static readonly UserRole PortAuthorityOfficer = new UserRole("PortAuthorityOfficer");
        public static readonly UserRole ShippingAgentRepresentative = new UserRole("ShippingAgentRepresentative");
        public static readonly UserRole LogisticsOperator = new UserRole("LogisticsOperator");

        protected UserRole()
        {
        }

        public UserRole(string role)
        {
            if (string.IsNullOrWhiteSpace(role))
                throw new BusinessRuleValidationException("Role cannot be empty.");

            role = role.Trim();

            if (!IsValidRole(role))
                throw new BusinessRuleValidationException($"Invalid role: {role}");

            this.Value = role;
        }

        private bool IsValidRole(string role)
        {
            return role == "None" ||
                   role == "Administrator" ||
                   role == "PortAuthorityOfficer" ||
                   role == "ShippingAgentRepresentative" ||
                   role == "LogisticsOperator";
        }

        public override bool Equals(object obj)
        {
            if (obj == null || obj.GetType() != typeof(UserRole))
                return false;

            var other = (UserRole)obj;
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

        public static implicit operator string(UserRole role)
        {
            return role.Value;
        }
    }
}