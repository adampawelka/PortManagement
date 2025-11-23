using System.ComponentModel.DataAnnotations;

namespace DDDSample1.Domain.Users
{
    public class ActivateUserDto
    {
        [Required]
        public string ActivationToken { get; set; }

        [Required]
        public string IamUserId { get; set; }
    }
}