using System;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Qualifications;
using DDDSample1.Domain.Shared;
using System.Collections.Generic;

namespace DDDSample1.Domain.StaffMembers
{
    public class StaffMemberService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffMemberRepository _staffRepo;
        private readonly IQualificationRepository _qualRepo;

        public StaffMemberService(IUnitOfWork unitOfWork, IStaffMemberRepository staffRepo, IQualificationRepository qualRepo)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _staffRepo = staffRepo ?? throw new ArgumentNullException(nameof(staffRepo));
            _qualRepo = qualRepo ?? throw new ArgumentNullException(nameof(qualRepo));
        }

        public async Task<StaffMemberDto> CreateStaffMemberAsync(CreateStaffMemberDto dto)
        {
            // Tworzymy VO
            var mecNumber = new MecanographicNumber(dto.MecanographicNumber);
            var operationalWindow = new OperationalWindow(dto.OperationalWindow);
            var staffId = new StaffMemberId(Guid.NewGuid()); // Guid zamiast string

            // Sprawdzenie duplikatu
            var existing = await _staffRepo.GetByMecanographicNumberAsync(mecNumber);
            if (existing != null)
            {
                throw new InvalidOperationException("A staff member with this mecanographic number already exists.");
            }

            // Mapowanie kwalifikacji na VO
            var qualIds = dto.QualificationIds.Select(id => new QualificationId(id)).ToList();
            var qualifications = await _qualRepo.GetByIdsAsync(qualIds);
            if (qualifications.Count != dto.QualificationIds.Count)
            {
                throw new ArgumentException("One or more qualification IDs are invalid.");
            }

            // Tworzenie encji
            var staffMember = new StaffMember(
                staffId,
                mecNumber,
                dto.ShortName,
                dto.Email,
                dto.Phone,
                operationalWindow,
                qualifications
            );

            staffMember.SetQualifications(qualifications);

            await _staffRepo.AddAsync(staffMember);
            await _unitOfWork.CommitAsync();

            return ToDto(staffMember);
        }

        public async Task<StaffMemberDto> DeactivateStaffMemberAsync(StaffMemberId id)
        {
            var member = await _staffRepo.GetByIdAsync(id);
            if (member == null) throw new EntityNotFoundException("StaffMember not found.");

            member.Deactivate();

            await _unitOfWork.CommitAsync();
            return ToDto(member);
        }

        public async Task<StaffMemberDto> ReactivateStaffMemberAsync(StaffMemberId id)
        {
            var member = await _staffRepo.GetByIdAsync(id);
            if (member == null) throw new EntityNotFoundException("StaffMember not found.");

            member.Reactivate();

            await _unitOfWork.CommitAsync();
            return ToDto(member);
        }

        public async Task<IEnumerable<StaffMemberDto>> GetAllStaffMembersAsync()
        {
            var staffMembers = await _staffRepo.GetAllStaffAsync();
            return staffMembers.Select(ToDto).ToList();
        }

        private StaffMemberDto ToDto(StaffMember s)
        {
            return new StaffMemberDto
            {
                Id = s.Id.AsGuid(),   
                MecanographicNumber = s.MecanographicNumber.Value,
                ShortName = s.ShortName,
                Email = s.Email,
                Phone = s.Phone,
                OperationalWindow = s.OperationalWindow.Value,
                Status = s.Status.ToString(),
                Qualifications = s.Qualifications.Select(q => new QualificationDto
            {
                Id = q.Id.AsGuid(),   
                Code = q.Code.Value,
                Name = q.Name.Value
            }).ToList()
            };
        }

    }
}
