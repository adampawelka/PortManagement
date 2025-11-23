// (IMPORTANT: This DTO also needs to be in QualificationDto)
using System;
using System.Collections.Generic;
using DDDSample1.Domain.Qualifications;

namespace DDDSample1.Domain.StaffMembers
{
    public class StaffMemberDto
    {
        public string Id { get; set; }
        public string MecanographicNumber { get; set; }
        public string ShortName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string OperationalWindow { get; set; }
        public string Status { get; set; }
        public List<QualificationDto> Qualifications { get; set; }
    }
}