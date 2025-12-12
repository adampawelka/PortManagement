namespace OEMAPI.Domain.VesselVisitExecutions
{
    public class VesselVisitExecution : Entity<VesselVisitExecutionId>, IAggregateRoot
    {
        public VvnId VvnId { get; private set; }
        public ArrivalTime ArrivalTime { get; private set; }
        public BerthTime BerthTime { get; private set; }
        public DockId DockId { get; private set; }
        public Status Status { get; private set; }
        public CreatedBy CreatedBy { get; private set; }

        private VesselVisitExecution() { }

        public VesselVisitExecution(
            VvnId vvnId, 
            ArrivalTime arrivalTime, 
            BerthTime berthTime,
            DockId dockId, 
            Status status, 
            CreatedBy createdBy)
        {
            Id = new VesselVisitExecutionId(Guid.NewGuid().ToString());
            VvnId = vvnId;
            ArrivalTime = arrivalTime;
            BerthTime = berthTime;
            DockId = dockId;
            Status = status;
            CreatedBy = createdBy;
        }

        public void Complete(BerthTime berthTime, Status status)
        {
            BerthTime = berthTime;
            Status = status;
        }
    }
}
