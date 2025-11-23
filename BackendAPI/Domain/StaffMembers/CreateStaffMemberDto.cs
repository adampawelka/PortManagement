using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DDDSample1.Domain.StaffMembers
{
    public class CreateStaffMemberDto
    {
        [Required]
        public string MecanographicNumber { get; set; }
        [Required]
        public string ShortName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [Phone]
        public string Phone { get; set; }
        public string OperationalWindow { get; set; }
        
        // Lista de IDs de cualificaciones
        public List<Guid> QualificationIds { get; set; } = new List<Guid>();
    }
}