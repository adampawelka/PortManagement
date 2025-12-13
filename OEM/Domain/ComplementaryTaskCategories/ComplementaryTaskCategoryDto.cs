using System;

namespace OEMAPI.Domain.ComplementaryTaskCategories
{
    public class ComplementaryTaskCategoryDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
