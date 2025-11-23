namespace DDDSample1.Domain.Qualifications
{
    public class UpdatingQualificationDto
    {
        public string Code { get; set; }
        public string Name { get; set; }

        public UpdatingQualificationDto(string code, string name)
        {
            Code = code;
            Name = name;
        }
    }
}
