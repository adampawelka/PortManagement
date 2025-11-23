using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Domain.Qualifications;
using Backend.Domain.Shared;

namespace Backend.Domain.StaffMembers
{
    public class StaffMemberService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffMemberRepository _staffRepo;
        private readonly IQualificationRepository _qualRepo;

        public StaffMemberService(IUnitOfWork unitOfWork, IStaffMemberRepository staffRepo, IQualificationRepository qualRepo)
        {
            _unitOfWork = unitOfWork;
            _staffRepo = staffRepo;
            _qualRepo = qualRepo;
        }

        public async Task<StaffMemberDto> CreateStaffMemberAsync(CreateStaffMemberDto dto)
        {
            // 1. Validar y crear Value Objects
            var mecNumber = new MecanographicNumber(dto.MecanographicNumber);
            var staffId = new StaffMemberId(Guid.NewGuid().ToString());

            // 2. Regla de negocio: unicidad (tarea del Servicio de Dominio)
            var existing = await _staffRepo.GetByMecanographicNumberAsync(mecNumber);
            if (existing != null)
            {
                throw new InvalidOperationException("A staff member with this mecanographic number already exists.");
            }

            // 3. Validar y obtener Agregados de Qualification
            var qualIds = dto.QualificationIds.Select(id => new QualificationId(id.ToString()));
            var qualifications = await _qualRepo.GetByIdsAsync(qualIds.ToList());
            if (qualifications.Count != dto.QualificationIds.Count)
            {
                throw new ArgumentException("One or more qualification IDs are invalid.");
            }

            // 4. Crear la Entidad
            var staffMember = new StaffMember(staffId, mecNumber, dto.ShortName, dto.Email, dto.Phone, dto.OperationalWindow, qualifications);
            staffMember.SetQualifications(qualifications);
            
            // 5. Añadir al repositorio y guardar
            await _staffRepo.AddAsync(staffMember);
            await _unitOfWork.CommitAsync();

            return MapToDto(staffMember);
        }

        public async Task<StaffMemberDto> DeactivateStaffMemberAsync(StaffMemberId id)
        {
            var member = await _staffRepo.GetByIdAsync(id);
            if (member == null) throw new EntityNotFoundException("StaffMember not found.");

            // 2. Llamar a la lógica de la Entidad
            member.Deactivate();

            // 3. Guardar
            await _unitOfWork.CommitAsync();
            return MapToDto(member);
        }

        public async Task<StaffMemberDto> ReactivateStaffMemberAsync(StaffMemberId id)
        {
            var member = await _staffRepo.GetByIdAsync(id);
            if (member == null) throw new EntityNotFoundException("StaffMember not found.");

            // 2. Llamar a la lógica de la Entidad
            member.Reactivate();

            // 3. Guardar
            await _unitOfWork.CommitAsync();
            return MapToDto(member);
        }
        
        // (Aquí también iría el método UpdateStaffMemberAsync, siguiendo el mismo patrón)

        private StaffMemberDto MapToDto(StaffMember s)
        {
            return new StaffMemberDto
            {
                Id = s.Id.AsString(),
                MecanographicNumber = s.MecanographicNumber.Value,
                ShortName = s.ShortName,
                Email = s.Email,
                Phone = s.Phone,
                OperationalWindow = s.OperationalWindow,
                Status = s.Status.ToString(),
                Qualifications = s.Qualifications.Select(q => new QualificationDto
                {
                    Id = q.Id.AsString(), 
                    Code = q.Code.Value, 
                    Name = q.Name.Value 
                }).ToList()
            };
        }
    }
}