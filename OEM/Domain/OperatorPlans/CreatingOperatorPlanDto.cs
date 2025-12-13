using System;

namespace OEMAPI.Domain.OperatorPlans
{
    public class CreatingOperatorPlanDto
    {
        public string VvnId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public string AlgorithmUsed { get; set; }

        public CreatingOperatorPlanDto(
            string vvnId,
            DateTime createdAt,
            string createdBy,
            string algorithmUsed)
        {
            VvnId = vvnId;
            CreatedAt = createdAt;
            CreatedBy = createdBy;
            AlgorithmUsed = algorithmUsed;
        }
    }
}
