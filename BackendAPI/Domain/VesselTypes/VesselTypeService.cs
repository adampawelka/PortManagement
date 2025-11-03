using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Domain.Shared;

namespace Backend.Domain.VesselTypes
{
    public class VesselTypeService 
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVesselTypeRepository _vesselTypeRepository;

        public VesselTypeService(IUnitOfWork unitOfWork, IVesselTypeRepository vesselTypeRepository)
        {
            _unitOfWork = unitOfWork;
            _vesselTypeRepository = vesselTypeRepository;
        }

        public async Task<List<VesselTypeDto>> GetAllAsync()
        {
            var vesselTypes = await _vesselTypeRepository.GetAllAsync();
            return vesselTypes.Select(ToDto).ToList();
        }

        private VesselTypeDto ToDto(VesselType vesselType)
        {
            return new VesselTypeDto(
                vesselType.Id.AsGuid(),
                vesselType.Name,
                vesselType.Description,
                vesselType.Capacity,
                vesselType.Constraints
            );
        }

        public async Task<VesselTypeDto> GetByIdAsync(Guid id)
        {
            var vesselType = await _vesselTypeRepository.GetByIdAsync(new VesselTypeId(id));
            if (vesselType == null)
                return null;

            return ToDto(vesselType);
        }

        public async Task<VesselTypeDto> AddAsync(CreatingVesselTypeDto dto)
        {
            var vesselType = new VesselType(
                dto.Name,
                dto.Description,
                dto.Capacity,
                dto.Constraints
            );

            await _vesselTypeRepository.AddVesselTypeAsync(vesselType);
            await _unitOfWork.CommitAsync();

            return ToDto(vesselType);
        }

        public async Task<VesselTypeDto> UpdateAsync(UpdatingVesselTypeDto dto)
        {
            var vesselType = await _vesselTypeRepository.GetByIdAsync(new VesselTypeId(dto.Id));
            if (vesselType == null)
                return null;
            
            vesselType.ChangeName(dto.Name);
            vesselType.ChangeDescription(dto.Description);
            vesselType.ChangeCapacity(dto.Capacity);
            vesselType.ChangeConstraints(dto.Constraints);

            await _unitOfWork.CommitAsync();

            return ToDto(vesselType);
        }

        public async Task<VesselTypeDto> DeleteAsync(Guid id)
        {
            var vesselType = await _vesselTypeRepository.GetByIdAsync(new VesselTypeId(id));
            if (vesselType == null)
                return null;

            _vesselTypeRepository.Remove(vesselType);
            await _unitOfWork.CommitAsync();

            return ToDto(vesselType);
        }

        public async Task<List<VesselTypeDto>> GetByNameAsync(string name)
        {
            var vesselTypes = await _vesselTypeRepository.GetByNameAsync(name);
            return vesselTypes.Select(ToDto).ToList();
        }

        public async Task<List<VesselTypeDto>> GetByDescriptionAsync(string description)
        {
            var vesselTypes = await _vesselTypeRepository.GetByDescriptionAsync(description);
            return vesselTypes.Select(ToDto).ToList();
        }

        public async Task<List<VesselTypeDto>> GetByCapacityRangeAsync(int minCapacity, int maxCapacity)
        {
            var vesselTypes = await _vesselTypeRepository.GetByCapacityRangeAsync(minCapacity, maxCapacity);
            return vesselTypes.Select(ToDto).ToList();
        }

        public async Task<List<VesselTypeDto>> GetByConstraintsAsync(int maxRows, int maxBays, int maxTiers)
        {
            var vesselTypes = await _vesselTypeRepository.GetByConstraintsAsync(maxRows, maxBays, maxTiers);
            return vesselTypes.Select(ToDto).ToList();
        }

        public async Task<List<VesselTypeDto>> SearchAsync(string? name, string? description, int? minCapacity, int? maxCapacity)
        {
            var vesselTypes = await _vesselTypeRepository.SearchAsync(name, description, minCapacity, maxCapacity);
            return vesselTypes.Select(ToDto).ToList();
        }
    }
}