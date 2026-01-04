using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OEMAPI.Domain.VesselVisitExecutions;

namespace OEMAPI.Domain.VesselVisitExecutions
{
    public interface IVesselVisitExecutionRepository
    {
        Task<List<VesselVisitExecution>> GetAllAsync();
        Task<VesselVisitExecution> GetByIdAsync(VesselVisitExecutionId id);
        Task<List<VesselVisitExecution>> GetByVvnIdAsync(Guid vvnId);
        Task<List<VesselVisitExecution>> GetByStatusAsync(string status);
        Task<List<VesselVisitExecution>> GetByCreatedByAsync(Guid createdById);
        Task<VesselVisitExecution> AddAsync(VesselVisitExecution vesselVisitExecution);
    }
}
