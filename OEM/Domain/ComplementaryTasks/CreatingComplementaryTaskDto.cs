using System;

namespace OEMAPI.Domain.ComplementaryTasks
{
    public class CreatingComplementaryTaskDto
    {
        public Guid ComplementaryTaskCategory { get; set; }
        public string VveId { get; set; }
        public string ResponsibleTeam { get; set; }
        public DateTime StartTime { get; set; }

        public CreatingComplementaryTaskDto(Guid ComplementaryTaskCategory, string vveId, string responsibleTeam, DateTime startTime)
        {
            ComplementaryTaskCategory = ComplementaryTaskCategory;
            VveId = vveId;
            ResponsibleTeam = responsibleTeam;
            StartTime = startTime;
        }
    }
}
