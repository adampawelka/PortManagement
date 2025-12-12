namespace OEMAPI.Domain.PlannedOperations
{
    public class PlannedOperation : Entity<PlannedOperationId>, IAggregateRoot
    {
        public OperatorPlanId OperatorPlanId { get; private set; }
        public ResourceId ResourceId { get; private set; }
        public StaffId StaffId { get; private set; }
        public PlannedStart PlannedStart { get; private set; }
        public PlannedEnd PlannedEnd { get; private set; }
        public OperationType OperationType { get; private set; }
        public Status Status { get; private set; }

        private PlannedOperation() { }

        public PlannedOperation(
            OperatorPlanId operatorPlanId,
            ResourceId resourceId,
            StaffId staffId,
            PlannedStart plannedStart,
            PlannedEnd plannedEnd,
            OperationType operationType,
            Status status)
        {
            Id = new PlannedOperationId(Guid.NewGuid().ToString());
            OperatorPlanId = operatorPlanId;
            ResourceId = resourceId;
            StaffId = staffId;
            PlannedStart = plannedStart;
            PlannedEnd = plannedEnd;
            OperationType = operationType;
            Status = status;
        }

        public void Update(PlannedStart newStart, PlannedEnd newEnd, Status newStatus)
        {
            PlannedStart = newStart;
            PlannedEnd = newEnd;
            Status = newStatus;
        }
    }
}
