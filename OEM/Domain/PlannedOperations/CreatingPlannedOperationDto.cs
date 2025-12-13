using System;

namespace OEMAPI.Domain.PlannedOperations
{
    public class CreatingPlannedOperationDto
    {
        public Guid OperatorPlanId { get; set; }
        public string ResourceId { get; set; }
        public string StaffId { get; set; }
        public DateTime PlannedStart { get; set; }
        public DateTime PlannedEnd { get; set; }
        public string OperationType { get; set; }
        public string Status { get; set; }

        public CreatingPlannedOperationDto(
            Guid operatorPlanId,
            string resourceId,
            string staffId,
            DateTime plannedStart,
            DateTime plannedEnd,
            string operationType,
            string status)
        {
            OperatorPlanId = operatorPlanId;
            ResourceId = resourceId;
            StaffId = staffId;
            PlannedStart = plannedStart;
            PlannedEnd = plannedEnd;
            OperationType = operationType;
            Status = status;
        }
    }
}
