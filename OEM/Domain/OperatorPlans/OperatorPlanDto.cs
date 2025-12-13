using System;
using System.Collections.Generic;

namespace OEMAPI.Domain.OperatorPlans
{
    public class OperatorPlanDto
    {
        public Guid Id { get; set; }
        public string VvnId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public string AlgorithmUsed { get; set; }

        public List<Guid> PlannedOperationIds { get; set; } = new();
    }
}
