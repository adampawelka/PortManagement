using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class PendingUser : Entity<PendingUserId>, IAggregateRoot
    {
        public UserEmail Email { get; private set; }
        public UserName Name { get; private set; }
        // IAM Provider attributes
        public string IamUserId { get; private set; }
        public DateTime AttemptedAt { get; set; };


        // Parameterless constructor for EF Core
        protected PendingUser()
        {
        }

        public PendingUser(UserEmail email, UserName name, string iamUserId)
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
            this.AttemptedAt = DateTime.UtcNow;
        }
       
    }
}