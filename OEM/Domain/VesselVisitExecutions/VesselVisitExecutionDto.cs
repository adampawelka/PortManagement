using System;

namespace OEMAPI.Domain.VesselVisitExecutions
{
    public class VesselVisitExecutionDto
    {
        public Guid Id { get; set; }
        public string VvnId { get; set; }
        public DateTime ArrivalTime { get; set; }
        public DateTime? BerthTime { get; set; }
        public string DockId { get; set; }
        public string Status { get; set; }
        public string CreatedBy { get; set; }
    }
}
