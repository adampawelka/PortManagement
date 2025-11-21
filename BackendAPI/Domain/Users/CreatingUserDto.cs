using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.Users
{
    public class CreatingUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string IamUserId { get; set; }

        [Required]
        public string Role { get; set; }
    }
}