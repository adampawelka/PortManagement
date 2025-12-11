using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ComplementaryTasks
{
    public class ComplementaryTask : Entity<ComplementaryTaskId>, IAggregateRoot
    {
        public CategoryId CategoryId { get; private set; }
        public VveId VveId { get; private set; }
        public ResponsibleTeam ResponsibleTeam { get; private set; }
        public StartTime StartTime { get; private set; }
        public EndTime EndTime { get; private set; }
        public Status Status { get; private set; }

        private ComplementaryTask() { }

        public ComplementaryTask(
            CategoryId categoryId,
            VveId vveId,
            ResponsibleTeam responsibleTeam,
            StartTime startTime)
        {
            Id = new ComplementaryTaskId(Guid.NewGuid().ToString());
            CategoryId = categoryId;
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
