using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ShippingAgents
{
    public class ShippingAgentService
    {
        private readonly IShippingAgentORepository _orgRepo;
        private readonly IShippingAgentRRepository _repRepo;
        private readonly IUnitOfWork _unitOfWork;

        public ShippingAgentService(
            IShippingAgentORepository orgRepo,
            IShippingAgentRRepository repRepo,
            IUnitOfWork unitOfWork)
        {
            _orgRepo = orgRepo;
            _repRepo = repRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<ShippingAgentOrganizationDto> RegisterOrganizationAsync(CreatingShippingAgentOrganizationDto dto)
        {
            var identifier = string.IsNullOrEmpty(dto.Identifier) 
                ? Guid.NewGuid().ToString() 
                : dto.Identifier;

            var existing = await _orgRepo.GetByIdAsync(new ShippingAgentOrganizationId(identifier));
            if (existing != null)
                throw new BusinessRuleValidationException("Organization with this identifier already exists.");

            if (dto.Representatives == null || !dto.Representatives.Any())
                throw new BusinessRuleValidationException("At least one representative is required.");

            var representatives = dto.Representatives.Select(r => new ShippingAgentRepresentative(
                new ShippingAgentRepresentativeId(Guid.NewGuid().ToString()),
                new RepName(r.Name),
                new CitizenId(r.CitizenId),
                new Nationality(r.Nationality),
                new RepEmail(r.Email),
                new RepPhone(r.Phone)
            )).ToList();

            var organization = new ShippingAgentOrganization(
                new ShippingAgentOrganizationId(identifier),
                new LegalName(dto.LegalName),
                dto.AlternativeNames?.Select(n => new AlternativeName(n)).ToList() ?? new List<AlternativeName>(),
                new Address(dto.Address),
                new TaxNumber(dto.TaxNumber),
                representatives);

            await _orgRepo.AddAsync(organization);
            await _unitOfWork.CommitAsync();

            return MapToDto(organization);
        }

        public async Task<List<ShippingAgentOrganizationDto>> GetAllAsync()
        {
            var organizations = await _orgRepo.GetAllAsync();
            return organizations.Select(MapToDto).ToList();
        }

        public async Task<ShippingAgentOrganizationDto> GetByIdAsync(string id)
        {
            var organization = await _orgRepo.GetByIdAsync(new ShippingAgentOrganizationId(id));
            return organization == null ? null : MapToDto(organization);
        }

        public async Task<ShippingAgentRepresentativeDto> GetRepresentativeByIdAsync(string representativeId)
        {
            var representative = await _repRepo.GetByIdAsync(new ShippingAgentRepresentativeId(representativeId));
            if (representative == null)
                return null;

            return new ShippingAgentRepresentativeDto
            {
                Id = representative.Id.AsString(),
                Name = representative.Name.Value,
                CitizenId = representative.CitizenId.Value,
                Nationality = representative.Nationality.Value,
                Email = representative.Email.Value,
                Phone = representative.Phone.Value
            };
        }

        public async Task<ShippingAgentOrganizationDto> AddRepresentativeAsync(
            string organizationId, 
            CreatingShippingAgentRepresentativeDto dto)
        {
            var organization = await _orgRepo.GetByIdAsync(new ShippingAgentOrganizationId(organizationId));
            if (organization == null)
                throw new BusinessRuleValidationException($"Organization with ID '{organizationId}' not found.");
            ValidateRepresentativeDto(dto);

            var existingRep = organization.Representatives
                .FirstOrDefault(r => r.CitizenId.Value == dto.CitizenId);
            if (existingRep != null)
                throw new BusinessRuleValidationException("A representative with this Citizen ID already exists in this organization.");

            var newRepresentative = new ShippingAgentRepresentative(
                new ShippingAgentRepresentativeId(Guid.NewGuid().ToString()),
                new RepName(dto.Name),
                new CitizenId(dto.CitizenId),
                new Nationality(dto.Nationality),
                new RepEmail(dto.Email),
                new RepPhone(dto.Phone)
            );

            await _repRepo.AddAsync(newRepresentative);
            
            organization.Representatives.Add(newRepresentative);

            await _unitOfWork.CommitAsync();

            organization = await _orgRepo.GetByIdAsync(new ShippingAgentOrganizationId(organizationId));
            return MapToDto(organization);
        }

        public async Task<ShippingAgentRepresentativeDto> UpdateRepresentativeAsync(
            string representativeId,
            CreatingShippingAgentRepresentativeDto dto)
        {
            ValidateRepresentativeDto(dto);

            var existingRepresentative = await _repRepo.GetByIdAsync(new ShippingAgentRepresentativeId(representativeId));
            if (existingRepresentative == null)
                throw new BusinessRuleValidationException($"Representative with ID '{representativeId}' not found.");

            var updatedRepresentative = new ShippingAgentRepresentative(
                new ShippingAgentRepresentativeId(representativeId), // Keep same ID
                new RepName(dto.Name),
                new CitizenId(dto.CitizenId),
                new Nationality(dto.Nationality),
                new RepEmail(dto.Email),
                new RepPhone(dto.Phone)
            );

            await _repRepo.UpdateAsync(updatedRepresentative);

            await _unitOfWork.CommitAsync();

            return new ShippingAgentRepresentativeDto
            {
                Id = updatedRepresentative.Id.AsString(),
                Name = updatedRepresentative.Name.Value,
                CitizenId = updatedRepresentative.CitizenId.Value,
                Nationality = updatedRepresentative.Nationality.Value,
                Email = updatedRepresentative.Email.Value,
                Phone = updatedRepresentative.Phone.Value
            };
        }

        public async Task<bool> DeactivateRepresentativeAsync(string organizationId, string representativeId)
        {
            var organization = await _orgRepo.GetByIdAsync(new ShippingAgentOrganizationId(organizationId));
            if (organization == null)
                return false;

            var representative = organization.Representatives
                .FirstOrDefault(r => r.Id.AsString() == representativeId);
            
            if (representative == null)
                return false;

            if (organization.Representatives.Count <= 1)
                throw new BusinessRuleValidationException("Cannot deactivate the last representative. Organization must have at least one representative.");

            organization.Representatives.Remove(representative);

            _repRepo.Remove(representative);

            await _unitOfWork.CommitAsync();

            return true;
        }

        private void ValidateRepresentativeDto(CreatingShippingAgentRepresentativeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new BusinessRuleValidationException("Representative name is required.");
            if (string.IsNullOrWhiteSpace(dto.CitizenId))
                throw new BusinessRuleValidationException("Citizen ID is required.");
            if (string.IsNullOrWhiteSpace(dto.Nationality))
                throw new BusinessRuleValidationException("Nationality is required.");
            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new BusinessRuleValidationException("Email is required.");
            if (string.IsNullOrWhiteSpace(dto.Phone))
                throw new BusinessRuleValidationException("Phone is required.");
        }

        private ShippingAgentOrganizationDto MapToDto(ShippingAgentOrganization organization)
        {
            return new ShippingAgentOrganizationDto
            {
                Id = organization.Id.AsString(),
                LegalName = organization.LegalName.Value,
                AlternativeNames = organization.AlternativeNames?.Select(n => n.Value).ToList() ?? new List<string>(),
                Address = organization.Address.Value,
                TaxNumber = organization.TaxNumber.Value,
                Representatives = organization.Representatives.Select(r => new ShippingAgentRepresentativeDto
                {
                    Id = r.Id.AsString(),
                    Name = r.Name.Value,
                    CitizenId = r.CitizenId.Value,
                    Nationality = r.Nationality.Value,
                    Email = r.Email.Value,
                    Phone = r.Phone.Value
                }).ToList()
            };
        }
    }

    public class CreatingShippingAgentOrganizationDto
    {
        public string Identifier { get; set; }
        public string LegalName { get; set; }
        public List<string> AlternativeNames { get; set; }
        public string Address { get; set; }
        public string TaxNumber { get; set; }
        public List<CreatingShippingAgentRepresentativeDto> Representatives { get; set; }
    }

    public class CreatingShippingAgentRepresentativeDto
    {
        public string Name { get; set; }
        public string CitizenId { get; set; }
        public string Nationality { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }

    public class ShippingAgentOrganizationDto
    {
        public string Id { get; set; }
        public string LegalName { get; set; }
        public List<string> AlternativeNames { get; set; }
        public string Address { get; set; }
        public string TaxNumber { get; set; }
        public List<ShippingAgentRepresentativeDto> Representatives { get; set; }
    }

    public class ShippingAgentRepresentativeDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string CitizenId { get; set; }
        public string Nationality { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}