using System;

namespace DDDSample1.Domain.Users
{
    public class PendingUserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string IamUserId { get; set; }
        public DateTime? AttemptedAt { get; set; }
    }
}