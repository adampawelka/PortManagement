using System;

namespace OEMAPI.Domain.ExecutedOperations
{
    public class CreatingExecutedOperationDto
    {
        public string VveId { get; set; }
        public string PlannedOperationId { get; set; }
        public string ResourceId { get; set; }
        public string StaffId { get; set; }
        public DateTime ActualStart { get; set; }
        public DateTime? ActualEnd { get; set; }
        public string Status { get; set; }

        public CreatingExecutedOperationDto(
            string vveId,
            string plannedOperationId,
            string resourceId,
            string staffId,
            DateTime actualStart,
            DateTime? actualEnd,
            string status)
        {
            VveId = vveId;
            PlannedOperationId = plannedOperationId;
            ResourceId = resourceId;
            StaffId = staffId;
            ActualStart = actualStart;
            ActualEnd = actualEnd;
            Status = status;
        }
    }
}
