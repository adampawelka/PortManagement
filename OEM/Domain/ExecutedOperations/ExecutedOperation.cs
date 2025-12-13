using OEMAPI.Domain.PlannedOperations;

namespace OEMAPI.Domain.ExecutedOperations
{
    public class ExecutedOperation : Entity<ExecutedOperationId>, IAggregateRoot
    {
        public VveId VveId { get; private set; }
        public PlannedOperation PlannedOperation { get; private set; }
        public ResourceId ResourceId { get; private set; }
        public StaffId StaffId { get; private set; }
        public ActualStart ActualStart { get; private set; }
        public ActualEnd ActualEnd { get; private set; }
        public Status Status { get; private set; }

        private ExecutedOperation() { }

        public ExecutedOperation(VveId vveId, PlannedOperation plannedOperation, ResourceId resourceId, StaffId staffId, ActualStart actualStart, ActualEnd actualEnd, Status status)
        {
            Id = new ExecutedOperationId(Guid.NewGuid().ToString());
            VveId = vveId;
            PlannedOperation = plannedOperation;
            ResourceId = resourceId;
            StaffId = staffId;
            ActualStart = actualStart;
            ActualEnd = actualEnd;
            Status = status;
        }
    }
}

