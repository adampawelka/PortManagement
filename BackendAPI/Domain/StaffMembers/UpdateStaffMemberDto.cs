using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.StaffMembers
{
    public class UpdateStaffMemberDto
    {
        [StringLength(100)]
        public string? ShortName { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        [Phone]
        public string? Phone { get; set; }
        public string? OperationalWindow { get; set; }
        public List<Guid>? QualificationIds { get; set; }
    }
}