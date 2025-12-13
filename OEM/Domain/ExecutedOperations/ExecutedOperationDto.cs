using System;

namespace OEMAPI.Domain.ExecutedOperations
{
    public class ExecutedOperationDto
    {
        public Guid Id { get; set; }
        public string VveId { get; set; }
        public Guid PlannedOperationId { get; set; }
        public string ResourceId { get; set; }
        public string StaffId { get; set; }
        public DateTime ActualStart { get; set; }
        public DateTime? ActualEnd { get; set; }
        public string Status { get; set; }
    }
}
