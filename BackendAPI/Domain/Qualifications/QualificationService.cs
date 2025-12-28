using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Qualifications
{
    public class QualificationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IQualificationRepository _repo;

        public QualificationService(IUnitOfWork unitOfWork, IQualificationRepository repo)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
        }

        public async Task<List<QualificationDto>> GetAllAsync()
        {
            var qualifications = await _repo.GetAllAsync();
            return qualifications.Select(MapToDto).ToList();
        }

        public async Task<QualificationDto?> GetByIdAsync(QualificationId id)
        {
            var qualification = await _repo.GetByIdAsync(id);
            return qualification == null ? null : MapToDto(qualification);
        }

        public async Task<QualificationDto> AddAsync(string code, string name)
        {
            var qualificationCode = new QualificationCode(code);
            var qualificationName = new QualificationName(name);

            var existing = await _repo.GetByCodeAsync(qualificationCode.Value);
            if (existing != null)
                throw new BusinessRuleValidationException($"A qualification with code '{code}' already exists.");

            var qualification = new Qualification(qualificationCode, qualificationName);

            await _repo.AddAsync(qualification);
            await _unitOfWork.CommitAsync();

            return MapToDto(qualification);
        }

        public async Task<QualificationDto?> UpdateAsync(QualificationId id, string code, string name)
        {
            var qualification = await _repo.GetByIdAsync(id);
            if (qualification == null)
                return null;

            var qualificationCode = new QualificationCode(code);
            var qualificationName = new QualificationName(name);

            var existing = await _repo.GetByCodeAsync(qualificationCode.Value);
            if (existing != null && !existing.Id.Equals(id))
                throw new BusinessRuleValidationException($"A qualification with code '{code}' already exists.");

            qualification.Update(qualificationCode, qualificationName);

            await _repo.UpdateAsync(qualification);
            await _unitOfWork.CommitAsync();

            return MapToDto(qualification);
        }

        public async Task<List<QualificationDto>> SearchAsync(string? code, string? name)
        {
            var qualifications = await _repo.SearchAsync(code, name);
            return qualifications.Select(MapToDto).ToList();
        }


        private QualificationDto MapToDto(Qualification qualification)
        {
            return new QualificationDto
            {
                Id = qualification.Id.AsString(),
                Code = qualification.Code.Value,
                Name = qualification.Name.Value
            };
        }
    }
}
