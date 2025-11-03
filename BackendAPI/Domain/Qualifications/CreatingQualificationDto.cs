namespace Backend.Domain.Qualifications
{
    public class CreatingQualificationDto
    {
        public string Code { get; set; }
        public string Name { get; set; }

        public CreatingQualificationDto(string code, string name)
        {
            Code = code;
            Name = name;
        }
    }
}
