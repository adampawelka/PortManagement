using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Domain.Shared;
using Backend.Domain.Qualifications;

namespace Backend.Domain.Resources
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
        public async Task<List<Resource>> GetAllAsync()
        {
            return await _resourceRepo.GetAllAsync();
        }

        public async Task<Resource> GetByIdAsync(ResourceId id)
        {
            return await _resourceRepo.GetByIdAsync(id);
        }

        public async Task<Resource> AddAsync(string code, string description, string type, double capacity, string status, int setupTime)
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

            return resource;
        }

        public async Task<Resource> UpdateAsync(ResourceId id, string newDescription, double newCapacity, int newSetupTime)
        {
            var resource = await _resourceRepo.GetByIdAsync(id);
            if (resource == null) return null;

            resource.Update(
                new ResourceDescription(newDescription),
                new OperationalCapacity(newCapacity),
                new SetupTime(newSetupTime)
            );

            await _unitOfWork.CommitAsync();
            return resource;
        }

        public async Task<Resource> ChangeStatusAsync(ResourceId id, string newStatus)
        {
            var resource = await _resourceRepo.GetByIdAsync(id);
            if (resource == null) return null;

            resource.ChangeStatus(new AvailabilityStatus(newStatus));
            await _unitOfWork.CommitAsync();

            return resource;
        }
        public async Task<Resource> AssignQualificationAsync(ResourceId id, QualificationId qualificationId)
        {
            var resource = await _resourceRepo.GetByIdAsync(id);
            if (resource == null) return null;

            resource.AssignQualification(qualificationId);
            await _unitOfWork.CommitAsync();

            return resource;
        }

        public async Task<Resource> RemoveQualificationAsync(ResourceId id, QualificationId qualificationId)
        {
            var resource = await _resourceRepo.GetByIdAsync(id);
            if (resource == null) return null;

            resource.RemoveQualification(qualificationId);
            await _unitOfWork.CommitAsync();

            return resource;
        }
    }
}
/*
`GetAllAsync():  Returns all registered resources. 
`GetByIdAsync():  Retrieves a resource by its identifier.
`AddAsync():  Creates a new resource using all its Value Objects.
`UpdateAsync():  Updates the resource’s capacity, description, and setup time.
`ChangeStatusAsync():  Changes the resource’s status (`active`, `inactive`, `maintenance`).
`AssignQualificationAsync():  Associates an existing qualification (from US14) with the resource.
`RemoveQualificationAsync():  Removes an associated qualification from the resource.
*/