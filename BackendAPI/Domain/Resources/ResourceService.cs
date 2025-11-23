using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Qualifications;

namespace DDDSample1.Domain.Resources
{
    public class ResourceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IResourceRepository _resourceRepo;

        public ResourceService(IUnitOfWork unitOfWork, IResourceRepository resourceRepo)
        {
            _unitOfWork = unitOfWork;
            _resourceRepo = resourceRepo;
        }

        private ResourceDto ToDto(Resource resource)
        {
            return new ResourceDto
            {
                Id = resource.Id.AsGuid(),
                Code = resource.Code.Value,
                Description = resource.Description.Value,
                Type = resource.Type.Value,
                Capacity = resource.Capacity.Value,
                Status = resource.Status.Value,
                SetupTime = resource.SetupTime.Value
            };
        }


        public async Task<List<ResourceDto>> GetAllAsync()
        {
            var resources = await _resourceRepo.GetAllAsync();
            return resources.Select(ToDto).ToList();
        }

        public async Task<ResourceDto> GetByIdAsync(ResourceId id)
        {
            var resource = await _resourceRepo.GetByIdAsync(id);
            if (resource == null) return null;
            return ToDto(resource);
        }

        public async Task<ResourceDto> AddAsync(string code, string description, string type, double capacity, string status, int setupTime)
        {
            var resource = new Resource(
                new ResourceCode(code),
                new ResourceDescription(description),
                new ResourceType(type),
                new OperationalCapacity(capacity),
                new AvailabilityStatus(status),
                new SetupTime(setupTime)
            );

            await _resourceRepo.AddAsync(resource);
            await _unitOfWork.CommitAsync();

            return ToDto(resource);
        }

        public async Task<ResourceDto> UpdateAsync(ResourceId id, string newDescription, double newCapacity, int newSetupTime)
        {
            var resource = await _resourceRepo.GetByIdAsync(id);
            if (resource == null) return null;

            resource.Update(
                new ResourceDescription(newDescription),
                new OperationalCapacity(newCapacity),
                new SetupTime(newSetupTime)
            );

            await _unitOfWork.CommitAsync();
            return ToDto(resource);
        }

        public async Task<ResourceDto> ChangeStatusAsync(ResourceId id, string newStatus)
        {
            var resource = await _resourceRepo.GetByIdAsync(id);
            if (resource == null) return null;

            resource.ChangeStatus(new AvailabilityStatus(newStatus));
            await _unitOfWork.CommitAsync();

            return ToDto(resource);
        }

        public async Task<ResourceDto> AssignQualificationAsync(ResourceId id, QualificationId qualificationId)
        {
            var resource = await _resourceRepo.GetByIdAsync(id);
            if (resource == null) return null;

            resource.AssignQualification(qualificationId);
            await _unitOfWork.CommitAsync();

            return ToDto(resource);
        }

        public async Task<ResourceDto> RemoveQualificationAsync(ResourceId id, QualificationId qualificationId)
        {
            var resource = await _resourceRepo.GetByIdAsync(id);
            if (resource == null) return null;

            resource.RemoveQualification(qualificationId);
            await _unitOfWork.CommitAsync();

            return ToDto(resource);
        }
    }
}
