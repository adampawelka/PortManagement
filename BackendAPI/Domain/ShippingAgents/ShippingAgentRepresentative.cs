using System;
using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public class ShippingAgentRepresentative : Entity<ShippingAgentRepresentativeId>
    {
        public RepName Name { get; private set; }
        public CitizenId CitizenId { get; private set; }
        public Nationality Nationality { get; private set; }
        public RepEmail Email { get; private set; }
        public RepPhone Phone { get; private set; }

        private ShippingAgentRepresentative() { }

        public ShippingAgentRepresentative(
            ShippingAgentRepresentativeId id,
            RepName name,
            CitizenId citizenId,
            Nationality nationality,
            RepEmail email,
            RepPhone phone)
        {
            Id = id ?? throw new BusinessRuleValidationException("Representative ID is required.");
            Name = name ?? throw new BusinessRuleValidationException("Name is required.");
            CitizenId = citizenId ?? throw new BusinessRuleValidationException("Citizen ID is required.");
            Nationality = nationality ?? throw new BusinessRuleValidationException("Nationality is required.");
            Email = email ?? throw new BusinessRuleValidationException("Email is required.");
            Phone = phone ?? throw new BusinessRuleValidationException("Phone is required.");
        }
    }
}