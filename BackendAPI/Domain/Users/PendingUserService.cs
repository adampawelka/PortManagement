using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class PendingUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPendingUserRepository _repo;

        public PendingUserService(IUnitOfWork unitOfWork, IPendingUserRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<PendingUserDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllPendingUsersAsync();
            return list.ConvertAll(user => ToDto(user));
        }

        public async Task<PendingUserDto> GetPendingUserByIdAsync(Guid id)
        {
            var user = await this._repo.GetPendingUserByIdAsync(new PendingUserId(id));
            return user == null ? null : ToDto(user);
        }

        public async Task<PendingUserDto> GetPendingUserByEmailAsync(string email)
        {
            var userEmail = new UserEmail(email);
            var user = await this._repo.GetPendingUserByEmailAsync(userEmail);
            return user == null ? null : ToDto(user);
        }

        public async Task<PendingUserDto> GetPendingUserByIamIdAsync(string iamUserId)
        {
            var user = await this._repo.GetPendingUserByIamIdAsync(iamUserId);
            return user == null ? null : ToDto(user);
        }

        public async Task<List<PendingUserDto>> SearchAsync(string searchTerm)
        {
            var list = await this._repo.SearchByNameOrEmailAsync(searchTerm);
            return list.ConvertAll(user => ToDto(user));
        }

        public async Task<PendingUserDto> AddPendingUserAsync(CreatingPendingUserDto dto)
        {
            var user = new PendingUser(
                new UserEmail(dto.Email),
                new UserName(dto.Name),
                dto.IamUserId
            );

            await _repo.AddPendingUserAsync(user);
            await _unitOfWork.CommitAsync();

            return ToDto(user);
        }

        public async Task<bool> RemovePendingUserAsync(Guid id)
        {
            var user = await _repo.GetPendingUserByIdAsync(new PendingUserId(id));
            if (user == null) return false;

            await _repo.RemovePendingUser(user);
            await _unitOfWork.CommitAsync();
            return true;
        }

        private PendingUserDto ToDto(PendingUser user)
        {
            return new PendingUserDto
            {
                Id = user.Id.AsGuid(),
                Email = user.Email.Value,
                Name = user.Name.Value,
                IamUserId = user.IamUserId,
                AttemptedAt = user.AttemptedAt,
            };
        }
    }
}