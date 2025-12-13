using System;

namespace OEMAPI.Domain.ComplementaryTasks
{
    public class CreatingComplementaryTaskDto
    {
        public string CategoryId { get; set; }
        public string VveId { get; set; }
        public string ResponsibleTeam { get; set; }
        public DateTime StartTime { get; set; }

        public CreatingComplementaryTaskDto(
            string categoryId,
            string vveId,
            string responsibleTeam,
            DateTime startTime)
        {
            CategoryId = categoryId;
            VveId = vveId;
            ResponsibleTeam = responsibleTeam;
            StartTime = startTime;
        }
    }
}
