using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class User : Entity<UserId>, IAggregateRoot
    {
        public UserEmail Email { get; private set; }
        public UserName Name { get; private set; }
        public UserRole Role { get; private set; }
        public UserStatus Status { get; private set; }
        public string ActivationToken { get; private set; }
        public DateTime? ActivationTokenExpiry { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }
        public DateTime? ActivatedAt { get; private set; }

        // IAM Provider attributes
        public string IamUserId { get; private set; }

        // Parameterless constructor for EF Core
        protected User()
        {
        }

        public User(UserEmail email, UserName name, string iamUserId)
        {
            if (email == null)
                throw new BusinessRuleValidationException("Email cannot be null.");
            if (name == null)
                throw new BusinessRuleValidationException("Name cannot be null.");
            if (string.IsNullOrWhiteSpace(iamUserId))
                throw new BusinessRuleValidationException("IAM User ID cannot be empty.");

            this.Id = new UserId(Guid.NewGuid());
            this.Email = email;
            this.Name = name;
            this.IamUserId = iamUserId;
            this.Status = UserStatus.Deactivated;
            this.Role = UserRole.None;
            this.CreatedAt = DateTime.UtcNow;
        }

        public void AssignRole(UserRole role)
        {
            if (role == null)
                throw new BusinessRuleValidationException("Role cannot be null.");

            this.Role = role;
            this.UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateRole(UserRole role)
        {
            if (role == null)
                throw new BusinessRuleValidationException("Role cannot be null.");

            this.Role = role;
            this.UpdatedAt = DateTime.UtcNow;
        }

        public void Activate()
        {
            if (this.Status == UserStatus.Active)
                throw new BusinessRuleValidationException("User is already active.");

            this.Status = UserStatus.Active;
            this.ActivatedAt = DateTime.UtcNow;
            this.UpdatedAt = DateTime.UtcNow;
            this.ActivationToken = null;
            this.ActivationTokenExpiry = null;
        }

        public void Deactivate()
        {
            if (this.Status == UserStatus.Deactivated)
                throw new BusinessRuleValidationException("User is already deactivated.");

            this.Status = UserStatus.Deactivated;
            this.UpdatedAt = DateTime.UtcNow;
        }

        public string GenerateActivationToken()
        {
            this.ActivationToken = Guid.NewGuid().ToString("N");
            this.ActivationTokenExpiry = DateTime.UtcNow.AddHours(24); // Token valid for 24 hours
            this.UpdatedAt = DateTime.UtcNow;
            return this.ActivationToken;
        }

        public bool ValidateActivationToken(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return false;

            if (this.ActivationToken != token)
                return false;

            if (this.ActivationTokenExpiry == null || this.ActivationTokenExpiry < DateTime.UtcNow)
                return false;

            return true;
        }

        public void UpdateEmail(UserEmail email)
        {
            if (email == null)
                throw new BusinessRuleValidationException("Email cannot be null.");

            this.Email = email;
            this.UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateName(UserName name)
        {
            if (name == null)
                throw new BusinessRuleValidationException("Name cannot be null.");

            this.Name = name;
            this.UpdatedAt = DateTime.UtcNow;
        }
    }
}