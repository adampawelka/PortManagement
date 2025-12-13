using System;

namespace OEMAPI.Domain.ComplementaryTasks
{
    public class ComplementaryTaskDto
    {
        public Guid Id { get; set; }
        public Guid ComplementaryTaskCategory { get; set; }
        public string VveId { get; set; }
        public string ResponsibleTeam { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Status { get; set; }
    }
}
