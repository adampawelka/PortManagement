using System;

namespace OEMAPI.Domain.ComplementaryTaskCategories
{
    public class CreatingComplementaryTaskCategoryDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public CreatingComplementaryTaskCategoryDto(
            string code,
            string name,
            string description)
        {
            Code = code;
            Name = name;
            Description = description;
        }
    }
}
