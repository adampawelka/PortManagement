
using System.Collections.Generic;
using System.Linq;
using Backend.Domain.Shared;

namespace Backend.Domain.ShippingAgents
{
    public class ShippingAgentOrganization : Entity<ShippingAgentOrganizationId>, IAggregateRoot
    {
        public LegalName LegalName { get; private set; }
        public List<AlternativeName> AlternativeNames { get; private set; }
        public Address Address { get; private set; }
        public TaxNumber TaxNumber { get; private set; }
        public List<ShippingAgentRepresentative> Representatives { get; private set; }

        private ShippingAgentOrganization() { }

        public ShippingAgentOrganization(
            ShippingAgentOrganizationId id,
            LegalName legalName,
            List<AlternativeName> alternativeNames,
            Address address,
            TaxNumber taxNumber,
            List<ShippingAgentRepresentative> representatives)
        {
            if (representatives == null || !representatives.Any())
                throw new BusinessRuleValidationException("At least one representative is required.");

            Id = id ?? throw new BusinessRuleValidationException("Identifier is required.");
            LegalName = legalName ?? throw new BusinessRuleValidationException("Legal name is required.");
            AlternativeNames = alternativeNames ?? new List<AlternativeName>();
            Address = address ?? throw new BusinessRuleValidationException("Address is required.");
            TaxNumber = taxNumber ?? throw new BusinessRuleValidationException("Tax number is required.");
            Representatives = representatives;
        }

        public void Update(
            LegalName legalName,
            List<AlternativeName> alternativeNames,
            Address address,
            TaxNumber taxNumber,
            List<ShippingAgentRepresentative> representatives)
        {
            if (representatives == null || !representatives.Any())
                throw new BusinessRuleValidationException("At least one representative is required.");

            LegalName = legalName ?? throw new BusinessRuleValidationException("Legal name is required.");
            AlternativeNames = alternativeNames ?? new List<AlternativeName>();
            Address = address ?? throw new BusinessRuleValidationException("Address is required.");
            TaxNumber = taxNumber ?? throw new BusinessRuleValidationException("Tax number is required.");
            Representatives = representatives;
        }
    }
}