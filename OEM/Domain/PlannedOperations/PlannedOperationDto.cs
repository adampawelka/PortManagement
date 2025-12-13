using System;

namespace OEMAPI.Domain.PlannedOperations
{
    public class PlannedOperationDto
    {
        public Guid Id { get; set; }
        public Guid OperatorPlanId { get; set; }
        public string ResourceId { get; set; }
        public string StaffId { get; set; }
        public DateTime PlannedStart { get; set; }
        public DateTime PlannedEnd { get; set; }
        public string OperationType { get; set; }
        public string Status { get; set; }
    }
}
