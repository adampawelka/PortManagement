using System;

namespace OEMAPI.Domain.VesselVisitExecutions
{
    public class CreatingVesselVisitExecutionDto
    {
        public string VvnId { get; set; }
        public DateTime ArrivalTime { get; set; }
        public DateTime? BerthTime { get; set; }
        public string DockId { get; set; }
        public string Status { get; set; }
        public string CreatedBy { get; set; }

        public CreatingVesselVisitExecutionDto(
            string vvnId,
            DateTime arrivalTime,
            DateTime? berthTime,
            string dockId,
            string status,
            string createdBy)
        {
            VvnId = vvnId;
            ArrivalTime = arrivalTime;
            BerthTime = berthTime;
            DockId = dockId;
            Status = status;
            CreatedBy = createdBy;
        }
    }
}
