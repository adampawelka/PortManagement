using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.VesselTypes {
    public class OperationalConstraints : IValueObject {
        public int MaxRows { get; private set; }
        public int MaxBays { get; private set; }
        public int MaxTiers { get; private set; }

        private OperationalConstraints() {

        }
    
        public OperationalConstraints(int maxRows, int maxBays, int maxTiers) {
            if (maxRows <= 0)
                throw new BusinessRuleValidationException("Maximum rows must be positive.");
            if (maxBays <= 0)
                throw new BusinessRuleValidationException("Maximum bays must be positive.");
            if (maxTiers <= 0)
                throw new BusinessRuleValidationException("Maximum tiers must be positive.");

            this.MaxRows = maxRows;
            this.MaxBays = maxBays;
            this.MaxTiers = maxTiers;
        }
    }
}