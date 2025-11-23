using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.VesselTypes;
using DDDSample1.Domain.ShippingAgents;

namespace DDDSample1.Domain.Vessels
{
    public class VesselService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVesselRepository _vesselRepository;
        private readonly IVesselTypeRepository _vesselTypeRepository;
        private readonly IShippingAgentORepository _shippingAgentORepository;

        public VesselService(
            IUnitOfWork unitOfWork,
            IVesselRepository vesselRepository,
            IVesselTypeRepository vesselTypeRepository,
            IShippingAgentORepository shippingAgentORepository)
        {
            _unitOfWork = unitOfWork;
            _vesselRepository = vesselRepository;
            _vesselTypeRepository = vesselTypeRepository;
            _shippingAgentORepository = shippingAgentORepository;
        }

        private VesselDto ToDto(Vessel vessel)
        {
            return new VesselDto
            {
                Id = vessel.Id.AsGuid(),
                IMO = vessel.IMO.Value,
                VesselName = vessel.VesselName.Value,
                OwnerId = vessel.Owner.Id.Value,
                VesselTypeId = vessel.VesselType.Id.AsGuid()
            };
        }

        public async Task<List<VesselDto>> GetAllVesselsAsync()
        {
            var vessels = await _vesselRepository.GetAllVesselsAsync();
            return vessels.Select(ToDto).ToList();
        }

        public async Task<VesselDto> GetVesselByIdAsync(Guid id)
        {
            var vessel = await _vesselRepository.GetVesselByIdAsync(new VesselId(id));
            if (vessel == null)
                return null;
            
            return ToDto(vessel);
        }

        public async Task<VesselDto> GetByIMOAsync(string imo)
        {
            var vessel = await _vesselRepository.GetVesselByIMOAsync(imo);
            if (vessel == null)
                return null;
            
            return ToDto(vessel);
        }

        public async Task<VesselDto> AddVesselAsync(CreatingVesselDto dto)
        {

            var vesselType = await _vesselTypeRepository.GetVesselTypeByIdAsync(new VesselTypeId(dto.VesselTypeId));
            if (vesselType == null)
                throw new BusinessRuleValidationException("Vessel type not found.");

            var owner = await _shippingAgentORepository.GetByIdAsync(new ShippingAgentOrganizationId(dto.OwnerId.ToString()));
            if (owner == null)
                throw new BusinessRuleValidationException("Shipping agent organization not found.");
        
            var vessel = new Vessel(
                new IMO(dto.IMO),
                new VesselName(dto.VesselName),
                vesselType,
                owner
            );

            await _vesselRepository.AddAsync(vessel);
            await _unitOfWork.CommitAsync();

            return ToDto(vessel);
        }

        public async Task<VesselDto> UpdateVesselAsync(Guid id, UpdatingVesselDto dto)
        {
            var vessel = await _vesselRepository.GetVesselByIdAsync(new VesselId(id));
            if (vessel == null)
                return null;

            ShippingAgentOrganization newOwner = null;
            if (!string.IsNullOrEmpty(dto.OwnerId))
            {
                newOwner = await _shippingAgentORepository.GetByIdAsync(new ShippingAgentOrganizationId(dto.OwnerId));
                if (newOwner == null)
                    throw new BusinessRuleValidationException("Shipping agent organization not found.");
            }

            vessel.UpdatingVessel(
                !string.IsNullOrEmpty(dto.VesselName) ? new VesselName(dto.VesselName) : null,
                newOwner
                );

        
            await _unitOfWork.CommitAsync();

            return ToDto(vessel);
        }

        public async Task<List<VesselDto>> SearchAsync(string? imo, string? name, Guid? ownerId)
        {
            var vessels = await _vesselRepository.SearchAsync(imo, name, ownerId);
            return vessels.Select(ToDto).ToList();
        }
    }
}