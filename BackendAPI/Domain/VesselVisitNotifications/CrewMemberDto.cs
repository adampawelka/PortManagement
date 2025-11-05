namespace Backend.Domain.VesselVisitNotifications
{
    public class CrewMemberDto
    {
        public string Name { get; set; }
        public string CitizenId { get; set; }
        public string Nationality { get; set; }

        public CrewMemberDto(string name, string citizenId, string nationality)
        {
            Name = name;
            CitizenId = citizenId;
            Nationality = nationality;
        }
    }
}