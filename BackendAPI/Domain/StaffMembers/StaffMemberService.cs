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
            _unitOfWork = unitOfWork;
            _staffRepo = staffRepo;
            _qualRepo = qualRepo;
        }

        public async Task<StaffMemberDto> CreateStaffMemberAsync(CreateStaffMemberDto dto)
        {
            var mecNumber = new MecanographicNumber(dto.MecanographicNumber);
            var staffId = new StaffMemberId(Guid.NewGuid().ToString());

            var existing = await _staffRepo.GetByMecanographicNumberAsync(mecNumber);
            if (existing != null)
            {
                throw new InvalidOperationException("A staff member with this mecanographic number already exists.");
            }

            var qualIds = dto.QualificationIds.Select(id => new QualificationId(id.ToString()));
            var qualifications = await _qualRepo.GetByIdsAsync(qualIds.ToList());
            if (qualifications.Count != dto.QualificationIds.Count)
            {
                throw new ArgumentException("One or more qualification IDs are invalid.");
            }

            var staffMember = new StaffMember(staffId, mecNumber, dto.ShortName, dto.Email, dto.Phone, dto.OperationalWindow, qualifications);
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
            var docks = await _staffRepo.GetAllStaffAsync();
            return docks.Select(ToDto).ToList();
        }

        private StaffMemberDto ToDto(StaffMember s)
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