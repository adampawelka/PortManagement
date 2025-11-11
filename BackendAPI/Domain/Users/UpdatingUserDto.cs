using System.ComponentModel.DataAnnotations;

namespace DDDSample1.Domain.Users
{
    public class UpdatingUserDto
    {
        [EmailAddress]
        public string Email { get; set; }
        
        public string Name { get; set; }

        public string Role { get; set; }
    }
}