using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Qualifications;
using System.Collections.Generic;
using System;

namespace DDDSample1.Domain.StaffMembers
{
    public class StaffMember : Entity<StaffMemberId>, IAggregateRoot
    {
        public MecanographicNumber MecanographicNumber { get; private set; }
        public string ShortName { get; private set; }
        public string Email { get; private set; }
        public string Phone { get; private set; }
        public OperationalWindow OperationalWindow { get; private set; } 
        public StaffStatus Status { get; private set; }
        public ICollection<Qualification> Qualifications { get; private set; }

        private StaffMember() {} 

        public StaffMember(
            StaffMemberId id,
            MecanographicNumber mecNumber,
            string shortName,
            string email,
            string phone,
            OperationalWindow operationalWindow, 
            List<Qualification> qualifications)
        {
            this.Id = id;
            this.MecanographicNumber = mecNumber;
            this.ShortName = shortName;
            this.Email = email;
            this.Phone = phone;
            this.OperationalWindow = operationalWindow;
            this.Status = StaffStatus.Active;
            this.Qualifications = qualifications ?? new List<Qualification>();
        }

        public void UpdateDetails(
            string newShortName,
            string newEmail,
            string newPhone,
            OperationalWindow newOperationalWindow) 
        {
            if (!string.IsNullOrWhiteSpace(newShortName))
                this.ShortName = newShortName;

            if (!string.IsNullOrWhiteSpace(newEmail))
                this.Email = newEmail;

            if (!string.IsNullOrWhiteSpace(newPhone))
                this.Phone = newPhone;

            if (newOperationalWindow != null)
                this.OperationalWindow = newOperationalWindow;
        }

        public void SetQualifications(List<Qualification> qualifications)
        {
            this.Qualifications = qualifications ?? new List<Qualification>();
        }

        public void Deactivate()
        {
            if (this.Status == StaffStatus.Inactive)
                throw new InvalidOperationException("Staff member is already inactive.");
            
            this.Status = StaffStatus.Inactive;
        }

        public void Reactivate()
        {
            if (this.Status == StaffStatus.Active)
                throw new InvalidOperationException("Staff member is already active.");
            
            this.Status = StaffStatus.Active;
        }
    }
}
