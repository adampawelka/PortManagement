using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Docks;

namespace DDDSample1.Domain.StorageAreas
{
    public class StorageAreaService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStorageAreaRepository _storageAreaRepository;
        private readonly IDockRepository _dockRepository;

        public StorageAreaService(
            IUnitOfWork unitOfWork,
            IStorageAreaRepository storageAreaRepository,
            IDockRepository dockRepository)
        {
            _unitOfWork = unitOfWork;
            _storageAreaRepository = storageAreaRepository;
            _dockRepository = dockRepository;
        }

        public async Task<List<StorageAreaDto>> GetAllAsync()
        {
            var storageAreas = await _storageAreaRepository.GetAllAsync();
            var docks = await _dockRepository.GetAllAsync();

            return storageAreas.Select(area => ToDto(area, docks)).ToList();
        }

        public async Task<StorageAreaDto?> GetByIdAsync(StorageAreaId id)
        {
            var storageArea = await _storageAreaRepository.GetByIdAsync(id);
            if (storageArea == null)
                return null;

            var docks = await _dockRepository.GetAllAsync();
            return ToDto(storageArea, docks);
        }

        public async Task<StorageAreaDto> AddAsync(CreateStorageAreaDto dto)
        {
            if (dto.CurrentOccupancy > dto.MaxCapacity)
                throw new BusinessRuleValidationException("Current occupancy cannot exceed maximum capacity.");

            // Convert List<DockDistanceInput> to Dictionary<Guid, double>
            var dockDistances = dto.DockDistances != null
                ? dto.DockDistances.ToDictionary(dd => dd.DockId, dd => dd.Distance)
                : new Dictionary<Guid, double>();

            var storageArea = new StorageArea(
                new StorageAreaType(dto.StorageAreaType),
                new StorageAreaLocation(dto.StorageAreaLocation),
                new Capacity(dto.MaxCapacity),
                new Occupancy(dto.CurrentOccupancy)
            );

            await ValidateAndAssignDockDistancesAsync(storageArea, dockDistances, dto.StorageAreaType);

            await _storageAreaRepository.AddAsync(storageArea);
            await _unitOfWork.CommitAsync();

            var docks = await _dockRepository.GetAllAsync();
            return ToDto(storageArea, docks);
        }

        public async Task<StorageAreaDto?> UpdateAsync(UpdateStorageAreaDto dto, Guid id)
        {
            var storageArea = await _storageAreaRepository.GetByIdAsync(new StorageAreaId(id));
            if (storageArea == null)
                return null;

            if (dto.CurrentOccupancy > dto.MaxCapacity)
                throw new BusinessRuleValidationException("Current occupancy cannot exceed maximum capacity.");

            // Convert List<DockDistanceInput> to Dictionary<Guid, double>
            var dockDistances = dto.DockDistances != null
                ? dto.DockDistances.ToDictionary(dd => dd.DockId, dd => dd.Distance)
                : new Dictionary<Guid, double>();

            storageArea.UpdateStorageArea(
                new Capacity(dto.MaxCapacity),
                new Occupancy(dto.CurrentOccupancy)
            );

            await ValidateAndAssignDockDistancesAsync(storageArea, dockDistances, dto.StorageAreaType);

            await _unitOfWork.CommitAsync();

            var docks = await _dockRepository.GetAllAsync();
            return ToDto(storageArea, docks);
        }

        public async Task<StorageAreaDto?> UpdateOccupancyAsync(UpdateOccupancyDto dto, Guid id)
        {
            var storageArea = await _storageAreaRepository.GetByIdAsync(new StorageAreaId(id));
            if (storageArea == null)
                return null;

            storageArea.UpdateOccupancy(new Occupancy(dto.CurrentOccupancy));

            await _unitOfWork.CommitAsync();

            var docks = await _dockRepository.GetAllAsync();
            return ToDto(storageArea, docks);
        }

        public async Task<StorageAreaDto?> DeleteAsync(StorageAreaId id)
        {
            var storageArea = await _storageAreaRepository.GetByIdAsync(id);
            if (storageArea == null)
                return null;

            _storageAreaRepository.Remove(storageArea);
            await _unitOfWork.CommitAsync();

            var docks = await _dockRepository.GetAllAsync();
            return ToDto(storageArea, docks);
        }

        private async Task ValidateAndAssignDockDistancesAsync(StorageArea storageArea, Dictionary<Guid, double> dockDistances, string storageAreaType)
        {
            var allDocks = await _dockRepository.GetAllAsync();

            if (dockDistances == null)
                throw new BusinessRuleValidationException("Dock distances cannot be null.");

            foreach (var (dockId, distance) in dockDistances)
            {
                if (double.IsNaN(distance) || double.IsInfinity(distance))
                    throw new BusinessRuleValidationException($"Distance for dock '{dockId}' cannot be NaN or infinite.");

                if (distance <= 0)
                    throw new BusinessRuleValidationException($"Distance for dock '{dockId}' must be greater than zero.");

                if (!allDocks.Any(d => d.Id.AsGuid() == dockId))
                    throw new BusinessRuleValidationException($"Dock with ID '{dockId}' does not exist.");
            }

            if (storageAreaType.Equals("Warehouse", StringComparison.OrdinalIgnoreCase))
            {
                // Warehouses must serve all docks
                foreach (var dock in allDocks)
                {
                    if (!dockDistances.ContainsKey(dock.Id.AsGuid()))
                        throw new BusinessRuleValidationException($"Distance to dock '{dock.DockName.Value}' must be specified for warehouses.");
                }

                storageArea.SetDockDistances(dockDistances);
            }
            else if (storageAreaType.Equals("Yard", StringComparison.OrdinalIgnoreCase))
            {
                // Yards must serve at least one dock
                if (dockDistances.Count == 0)
                    throw new BusinessRuleValidationException("A yard must serve at least one dock.");

                storageArea.SetDockDistances(dockDistances);
            }
            else
            {
                throw new BusinessRuleValidationException($"Invalid storage area type '{storageAreaType}'. Expected 'Warehouse' or 'Yard'.");
            }
        }

        private StorageAreaDto ToDto(StorageArea storageArea, IEnumerable<Dock> allDocks)
        {
            var dockInfo = storageArea.DockDistances.Select(pair =>
            {
                var dock = allDocks.FirstOrDefault(d => d.Id.AsGuid() == pair.Key);
                return new DockDistanceDto
                {
                    DockId = pair.Key,
                    DockName = dock?.DockName?.Value ?? "Unknown Dock",
                    Distance = pair.Value
                };
            }).ToList();

            return new StorageAreaDto
            {
                Id = storageArea.Id.AsGuid(),
                StorageAreaType = storageArea.Type.Value,
                StorageAreaLocation = storageArea.Location.Value,
                MaxCapacity = storageArea.MaxCapacity.Value,
                CurrentOccupancy = storageArea.CurrentOccupancy.Value,
                DockDistances = dockInfo
            };
        }
    }
}