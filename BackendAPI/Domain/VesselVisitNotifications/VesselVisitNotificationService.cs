using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Vessels;
using DDDSample1.Domain.ShippingAgents;
using DDDSample1.Domain.Docks;

namespace DDDSample1.Domain.VesselVisitNotifications
{
    public class VesselVisitNotificationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVesselVisitNotificationRepository _VesselVisitNotificationRepository;
        private readonly IVesselRepository _vesselRepository;
        private readonly IShippingAgentORepository _shippingAgentORepository;
        private readonly IShippingAgentRRepository _shippingAgentRepRepository; // FIXED: Added representative repo
        private readonly IDockRepository _dockRepo;

        public VesselVisitNotificationService(
            IUnitOfWork unitOfWork,
            IVesselVisitNotificationRepository VesselVisitNotificationRepository,
            IVesselRepository vesselRepository,
            IShippingAgentORepository shippingAgentORepository,
            IShippingAgentRRepository shippingAgentRepRepository, // FIXED: Added parameter
            IDockRepository dockRepo)
        {
            _unitOfWork = unitOfWork;
            _VesselVisitNotificationRepository = VesselVisitNotificationRepository;
            _vesselRepository = vesselRepository;
            _shippingAgentORepository = shippingAgentORepository;
            _shippingAgentRepRepository = shippingAgentRepRepository; // FIXED: Store reference
            _dockRepo = dockRepo;
        }

        // --- Métodos 'Get' de 2.2.9 ---
        public async Task<List<VesselVisitNotificationDto>> GetAllNotificationsAsync()
        {
            var vesselVisitNotifications = await _VesselVisitNotificationRepository.GetAllNotificationsAsync();
            return vesselVisitNotifications.Select(ToDto).ToList();
        }

        public async Task<VesselVisitNotificationDto> GetNotificationByIdAsync(VesselVisitNotificationId id)
        {
            var vesselVisitNotification = await _VesselVisitNotificationRepository.GetNotificationByIdAsync(id);
            return vesselVisitNotification == null ? null : ToDto(vesselVisitNotification);
        }

        public async Task<List<VesselVisitNotificationDto>> GetByVesselIdAsync(Guid id)
        {
            var vesselVisitNotifications = await _VesselVisitNotificationRepository.GetNotificationByVesselIdAsync(id);
            return vesselVisitNotifications.Select(ToDto).ToList();
        }

        public async Task<List<VesselVisitNotificationDto>> GetByStatusAsync(string status)
        {
            var vesselVisitNotifications = await _VesselVisitNotificationRepository.GetByStatusAsync(status);
            return vesselVisitNotifications.Select(ToDto).ToList();
        }

        public async Task<List<VesselVisitNotificationDto>> GetBySubmittedByIdAsync(Guid submittedById)
        {
            var vesselVisitNotifications = await _VesselVisitNotificationRepository.GetBySubmittedByIdAsync(submittedById);
            return vesselVisitNotifications.Select(ToDto).ToList();
        }

        // --- Método 'Add' de 2.2.9 ---
        public async Task<VesselVisitNotificationDto> AddVesselVisitNotificationAsync(CreatingVesselVisitNotificationDto dto)
{

    var vessel = await _vesselRepository.GetByIdAsync(new VesselId(dto.VesselId));
    if (vessel == null)
        throw new BusinessRuleValidationException("Invalid Vessel ID.");

   
    var agent = await _shippingAgentRepRepository.GetByIdAsync(
        new ShippingAgentRepresentativeId(dto.SubmittedById.ToString()));
    if (agent == null)
        throw new BusinessRuleValidationException("Invalid Shipping Agent Representative ID.");

    var cargoManifests = dto.CargoManifests?
        .Select(c =>
        {
            var containers = c.ContainerIdentifiers.Select(id => new ContainerIdentifier(id)).ToList();
            return new CargoManifest(c.ManifestType, containers);
        })
        .ToList() ?? new List<CargoManifest>();

    var crewMembers = dto.CrewMembers?
        .Select(c => new CrewMember(c.Name, c.CitizenId, c.Nationality))
        .ToList() ?? new List<CrewMember>();


    var vnn = new VesselVisitNotification(
        new VesselId(dto.VesselId),
        new ShippingAgentRepresentativeId(dto.SubmittedById.ToString()),
        dto.ETA,
        dto.ETD,
        cargoManifests,
        crewMembers
    );

    await _VesselVisitNotificationRepository.AddAsync(vnn);
    await _unitOfWork.CommitAsync();
    
    // Need to reload with navigation properties for DTO
    var savedVnn = await _VesselVisitNotificationRepository.GetNotificationByIdAsync(vnn.Id);
    return ToDto(savedVnn);
}

        // --- Método 'Update' FUSIONADO ---
        public async Task<VesselVisitNotificationDto> UpdateVesselVisitNotificationAsync(UpdatingVesselVisitNotificationDto dto, Guid id)
{
    var vnn = await _VesselVisitNotificationRepository.GetByIdAsync(new VesselVisitNotificationId(id));
    if (vnn == null)
        return null;
    
    // Mapear DTOs a Entidades de Dominio
    var cargoManifests = dto.CargoManifests?
        .Select(c =>
        {
            var containers = c.ContainerIdentifiers.Select(cid => new ContainerIdentifier(cid)).ToList();
            return new CargoManifest(c.ManifestType, containers);
        })
        .ToList() ?? new List<CargoManifest>();

    var crewMembers = dto.CrewMembers?
        .Select(c => new CrewMember(c.Name, c.CitizenId, c.Nationality))
        .ToList() ?? new List<CrewMember>();
    
    // Llamar a la lógica de negocio en la Entidad
    vnn.UpdateVesselVisitNotification(
        dto.ETA,
        dto.ETD,
        cargoManifests,
        crewMembers
    );

    await _unitOfWork.CommitAsync();
    
    // RELOAD the entity with navigation properties
    var updatedVnn = await _VesselVisitNotificationRepository.GetNotificationByIdAsync(new VesselVisitNotificationId(id));
    return ToDto(updatedVnn);
    }

        // --- Método 'Submit' de 2.2.9 ---
        public async Task<VesselVisitNotificationDto> SubmitVesselVisitNotificationAsync(Guid id)
    {
    var vnn = await _VesselVisitNotificationRepository.GetNotificationByIdAsync(new VesselVisitNotificationId(id));
    if (vnn == null)
        throw new BusinessRuleValidationException("Vessel Visit Notification not found.");

    vnn.Submit();
    await _unitOfWork.CommitAsync();
    
    // RELOAD the entity with navigation properties
    var submittedVnn = await _VesselVisitNotificationRepository.GetNotificationByIdAsync(new VesselVisitNotificationId(id));
    return ToDto(submittedVnn);
    }

        // --- MÉTODO 'Approve' FUSIONADO (de 2.2.8) ---
        public async Task<VesselVisitNotificationDto> ApproveVesselVisitNotificationAsync(Guid notificationId, ApproveNotificationDto dto, Guid officerId)
        {
            var vnnId = new VesselVisitNotificationId(notificationId);
            var vnn = await _VesselVisitNotificationRepository.GetNotificationByIdAsync(vnnId);
            if (vnn == null)
                throw new EntityNotFoundException("Vessel Visit Notification not found.");

            var dockId = new DockId(dto.DockId);
            var dock = await _dockRepo.GetByIdAsync(dockId);
            if (dock == null)
                throw new ArgumentException("Invalid Dock ID. The specified dock does not exist.");

            vnn.Approve(dockId, officerId);
            await _unitOfWork.CommitAsync();
            return ToDto(vnn);
        }

        // --- MÉTODO 'Reject' FUSIONADO (de 2.2.8) ---
        public async Task<VesselVisitNotificationDto> RejectVesselVisitNotificationAsync(Guid notificationId, RejectNotificationDto dto, Guid officerId)
        {
            var vnnId = new VesselVisitNotificationId(notificationId);
            var vnn = await _VesselVisitNotificationRepository.GetNotificationByIdAsync(vnnId);
            if (vnn == null)
                throw new EntityNotFoundException("Vessel Visit Notification not found.");

            vnn.Reject(dto.Reason, officerId);
            await _unitOfWork.CommitAsync();
            return ToDto(vnn);
        }

        // --- MÉTODO 'ToDto' FUSIONADO ---
        private VesselVisitNotificationDto ToDto(VesselVisitNotification vnn)
        {
            return new VesselVisitNotificationDto(
                vnn.Id.AsGuid(),
                vnn.Vessel.Id.AsGuid(),
                vnn.Vessel.VesselName.Value, 
                vnn.Vessel.IMO.Value,         
                Guid.Parse(vnn.SubmittedBy.Id.AsString()), 
                vnn.SubmittedBy.Name.Value,   
                vnn.Status.Value,
                vnn.ETA,
                vnn.ETD,
                vnn.CargoManifests
                    .Select(cm => new CargoManifestDto(
                        cm.ManifestType,
                        cm.Containers.Select(c => c.Value).ToList()
                    ))
                    .ToList(),
                vnn.CrewMembers
                    .Select(cm => new CrewMemberDto(cm.Name, cm.CitizenId, cm.Nationality))
                    .ToList(),
                vnn.AssignedDockId?.AsGuid(),
                vnn.RejectionReason,
                vnn.DecidingOfficerId,
                vnn.DecisionTimestamp
            );
        }
    }
}