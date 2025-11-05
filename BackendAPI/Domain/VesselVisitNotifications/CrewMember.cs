using Backend.Domain.Shared;

namespace Backend.Domain.VesselVisitNotifications
{
    public class CrewMember : IValueObject
    {
        public string Name { get; private set; }
        public string CitizenId { get; private set; }
        public string Nationality { get; private set; }

        private CrewMember()
        {
        }

        public CrewMember(string name, string citizenId, string nationality)
        {
            if (string.IsNullOrEmpty(name))
                throw new BusinessRuleValidationException("Crew member name cannot be empty.");
            if (string.IsNullOrEmpty(citizenId))
                throw new BusinessRuleValidationException("Crew member citizen ID cannot be empty.");
            if (string.IsNullOrEmpty(nationality))
                throw new BusinessRuleValidationException("Crew member nationality cannot be empty.");

            Name = name;
            CitizenId = citizenId;
            Nationality = nationality;
        }
    }
}