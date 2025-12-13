using System;
using DDDSample1.Domain.Shared;
using OEMAPI.Domain.ComplementaryTaskCategories;

namespace OEMAPI.Domain.ComplementaryTasks
{
    public class ComplementaryTask : Entity<ComplementaryTaskId>, IAggregateRoot
    {
        public ComplementaryTaskCategory Category { get; private set; }
        public VveId VveId { get; private set; }
        public ResponsibleTeam ResponsibleTeam { get; private set; }
        public StartTime StartTime { get; private set; }
        public EndTime EndTime { get; private set; }
        public Status Status { get; private set; }

        private ComplementaryTask() { }

        public ComplementaryTask(
            ComplementaryTaskCategory category,
            VveId vveId,
            ResponsibleTeam responsibleTeam,
            StartTime startTime)
        {
            Id = new ComplementaryTaskId(Guid.NewGuid().ToString());
            Category = category;
            VveId = vveId;
            ResponsibleTeam = responsibleTeam;
            StartTime = startTime;
            EndTime = new EndTime(null);   // ongoing task
            Status = Status.Ongoing();
        }

        public void Complete(EndTime endTime)
        {
            if (endTime.Value < StartTime.Value)
                throw new BusinessRuleValidationException("End time cannot be before start time.");

            EndTime = endTime;
            Status = Status.Completed();
        }
    }
}
