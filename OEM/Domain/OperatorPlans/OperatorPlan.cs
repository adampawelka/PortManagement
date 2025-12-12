namespace OEMAPI.Domain.OperatorPlans
{
    public class OperatorPlan : Entity<OperatorPlanId>, IAggregateRoot
    {
        public OperatorVvnId VvnId { get; private set; }
        public CreatedAt CreatedAt { get; private set; }
        public CreatedBy CreatedBy { get; private set; }
        public AlgorithmUsed AlgorithmUsed { get; private set; }

        private readonly List<PlannedOperation> _operations = new();
        public IReadOnlyCollection<PlannedOperation> Operations => _operations.AsReadOnly();

        private OperatorPlan() { }

        public OperatorPlan(
            OperatorVvnId vvnId, 
            CreatedAt createdAt, 
            CreatedBy createdBy, 
            AlgorithmUsed algorithmUsed)
        {
            Id = new OperatorPlanId(Guid.NewGuid().ToString());
            VvnId = vvnId;
            CreatedAt = createdAt;
            CreatedBy = createdBy;
            AlgorithmUsed = algorithmUsed;
        }

        public void AddOperation(PlannedOperation operation)
        {
            _operations.Add(operation);
        }
    }
}
