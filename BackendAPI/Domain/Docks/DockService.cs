using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.VesselTypes;

namespace DDDSample1.Domain.Docks
{
    public class DockService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDockRepository _dockRepository;
        private readonly IVesselTypeRepository _vesselTypeRepository;

        public DockService(
            IUnitOfWork unitOfWork,
            IDockRepository dockRepository,
            IVesselTypeRepository vesselTypeRepository)
        {
            _unitOfWork = unitOfWork;
            _dockRepository = dockRepository;
            _vesselTypeRepository = vesselTypeRepository;
        }

        // Get all docks
        public async Task<List<DockDto>> GetAllAsync()
        {
            var docks = await _dockRepository.GetAllDocksAsync();
            return docks.Select(ToDto).ToList();
        }

        // Get dock by ID
        public async Task<DockDto> GetByIdAsync(DockId id)
        {
            var dock = await _dockRepository.GetDockByIdAsync(id);
            if (dock == null)
                return null;

            return ToDto(dock);
        }

        // Add a new dock
        public async Task<DockDto> AddDockAsync(CreatingDockDto dto)
        {
            var dock = new Dock(
                new DockName(dto.DockName),
                new DockLocation(dto.DockLocation),
                new Depth(dto.Depth),
                new Length(dto.Length),
                new MaxDraft(dto.MaxDraft)
            );
            var vesselTypes = await ValidateAndGetVesselTypesAsync(dto.AllowedVesselTypes ?? new List<Guid>());
            foreach (var vt in vesselTypes)
            {
                dock.AllowVesselType(vt);
            }

            await _dockRepository.AddDockAsync(dock);
            await _unitOfWork.CommitAsync();

            return ToDto(dock);
        }

        // Update an existing dock
        public async Task<DockDto> UpdateDockAsync(UpdatingDockDto dto, Guid id)
        {
            var dock = await _dockRepository.GetByIdAsync(new DockId(id));
            if (dock == null)
                return null;

            dock.UpdateDock(
                dto.DockName != null ? new DockName(dto.DockName) : null,
                dto.DockLocation != null ? new DockLocation(dto.DockLocation) : null,
                dto.Depth.HasValue ? new Depth(dto.Depth.Value) : null,
                dto.Length.HasValue ? new Length(dto.Length.Value) : null,
                dto.MaxDraft.HasValue ? new MaxDraft(dto.MaxDraft.Value) : null
            );





            await _unitOfWork.CommitAsync();
            return ToDto(dock);
        }

        private async Task<List<VesselType>> ValidateAndGetVesselTypesAsync(List<Guid> vesselTypeIds)
        {
            if (vesselTypeIds == null || !vesselTypeIds.Any())
                return new List<VesselType>();

            var vesselTypes = await _vesselTypeRepository.GetByIdsAsync(vesselTypeIds.Select(id => new VesselTypeId(id)).ToList());
            var foundIds = vesselTypes.Select(vt => vt.Id.AsGuid()).ToHashSet();

            var missing = vesselTypeIds.Where(id => !foundIds.Contains(id)).ToList();
            if (missing.Any())
                throw new BusinessRuleValidationException($"Invalid vessel type IDs: {string.Join(", ", missing)}");

            return vesselTypes;
        }

        // Mapper from Dock domain entity to DockDto
        private DockDto ToDto(Dock dock)
        {
            return new DockDto
            {
                Id = dock.Id.AsGuid(),
                DockName = dock.DockName.Value,
                DockLocation = dock.DockLocation.Value,
                Depth = dock.Depth.Value,
                Length = dock.Length.Value,
                MaxDraft = dock.MaxDraft.Value,
                AllowedVesselTypes = dock.AllowedVesselTypes.Select(vt => new VesselTypeDto(
                    vt.Id.AsGuid(),              // Pass the Id as a Guid
                    vt.Name,                      // Use Name directly if it's a string
                    vt.Description,               // Use Description directly if it's a string
                    vt.Capacity,                  // Use Capacity directly if it's an int (or any primitive type)
                    vt.Constraints                // Use Constraints directly if it's already of type OperationalConstraints
                )).ToList()
            };            
        }

        public async Task<List<DockDto>> GetByNameAsync(string name)
        {
            var docks = await _dockRepository.GetByNameAsync(name);
            return docks.Select(ToDto).ToList();
        }

        public async Task<List<DockDto>> GetByLocationAsync(string location)
        {
            var docks = await _dockRepository.GetByLocationAsync(location);
            return docks.Select(ToDto).ToList();
        }

        public async Task<List<DockDto>> GetByVesselTypeAsync(Guid vesselTypeId)
        {
            var docks = await _dockRepository.GetByVesselTypeAsync(vesselTypeId);
            return docks.Select(ToDto).ToList();
        }

        public async Task<List<DockDto>> SearchAsync(string? name, string? location, Guid? vesselTypeId)
        {
            var docks = await _dockRepository.SearchAsync(name, location, vesselTypeId);
            return docks.Select(ToDto).ToList();
        }

    }
}
