using System.ComponentModel.DataAnnotations;

namespace DDDSample1.Domain.Users
{
    public class CreatingPendingUserDto
    {
        public string Email { get; set; }

        public string Name { get; set; }

        public string IamUserId { get; set; }

        public CreatingPendingUserDto() {}

        public CreatingPendingUserDto(string email, string name, string iamuserid) 
        {
            Email = email;
            Name = name;
            IamUserId = iamuserid;
        }

    }
}