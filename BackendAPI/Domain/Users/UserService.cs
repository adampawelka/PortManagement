using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _repo;

        public UserService(IUnitOfWork unitOfWork, IUserRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var list = await this._repo.GetAllUsersAsync();
            return list.ConvertAll(user => ToDto(user));
        }

        public async Task<UserDto> GetUserByIdAsync(Guid id)
        {
            var user = await this._repo.GetUserByIdAsync(new UserId(id));
            return user == null ? null : ToDto(user);
        }

        public async Task<UserDto> GetByEmailAsync(string email)
        {
            var userEmail = new UserEmail(email);
            var user = await this._repo.GetByEmailAsync(userEmail);
            return user == null ? null : ToDto(user);
        }

        public async Task<UserDto> GetUserByIamIdAsync(string iamUserId)
        {
            var user = await this._repo.GetUserByIamIdAsync(iamUserId);
            return user == null ? null : ToDto(user);
        }

        public async Task<List<UserDto>> GetByRoleAsync(string role)
        {
            var userRole = new UserRole(role);
            var list = await this._repo.GetByRoleAsync(userRole);
            return list.ConvertAll(user => ToDto(user));
        }

        public async Task<List<UserDto>> GetByStatusAsync(string status)
        {
            var userStatus = new UserStatus(status);
            var list = await this._repo.GetByStatusAsync(userStatus);
            return list.ConvertAll(user => ToDto(user));
        }

        public async Task<List<UserDto>> SearchAsync(string searchTerm)
        {
            var list = await this._repo.SearchByNameOrEmailAsync(searchTerm);
            return list.ConvertAll(user => ToDto(user));
        }

        public async Task<UserDto> AddAsync(CreatingUserDto dto)
        {
            var existingByEmail = await this._repo.GetByEmailAsync(new UserEmail(dto.Email));
            if (existingByEmail != null)
                throw new BusinessRuleValidationException("A user with this email already exists.");

            var existingByIam = await this._repo.GetByIamIdAsync(dto.IamUserId);
            if (existingByIam != null)
                throw new BusinessRuleValidationException("A user with this IAM ID already exists.");

            var user = new User(
                new UserEmail(dto.Email),
                new UserName(dto.Name),
                dto.IamUserId
            );

            user.AssignRole(new UserRole(dto.Role));

            // Generate activation token
            var token = user.GenerateActivationToken();

            await this._repo.AddAsync(user);
            await this._unitOfWork.CommitAsync();

            // TODO: Send activation email with token
            // await _emailService.SendActivationEmail(user.Email, token);

            return ToDto(user);
        }

        public async Task<UserDto> UpdateAsync(UserId id, UpdatingUserDto dto)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                return null;

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                var existingUser = await this._repo.GetByEmailAsync(new UserEmail(dto.Email));
                if (existingUser != null && !existingUser.Id.Equals(id))
                    throw new BusinessRuleValidationException("Another user with this email already exists.");

                user.UpdateEmail(new UserEmail(dto.Email));
            }

            if (!string.IsNullOrWhiteSpace(dto.Name))
            {
                user.UpdateName(new UserName(dto.Name));
            }

            if (!string.IsNullOrWhiteSpace(dto.Role))
            {
                user.UpdateRole(new UserRole(dto.Role));
            }

            await this._unitOfWork.CommitAsync();

            return ToDto(user);
        }

        public async Task<UserDto> AssignRoleAsync(UserId id, string role)
        {
            var user = await this._repo.GetUserByIdAsync(id);

            if (user == null)
                return null;

            user.AssignRole(new UserRole(role));

            await this._unitOfWork.CommitAsync();

            return ToDto(user);
        }

        public async Task<string> GenerateActivationTokenAsync(UserId id)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                throw new EntityNotFoundException($"User with ID {id} not found.");

            var token = user.GenerateActivationToken();

            await this._unitOfWork.CommitAsync();

            // TODO: Send activation email
            // await _emailService.SendActivationEmail(user.Email, token);

            return token;
        }

        public async Task<UserDto> ActivateAsync(ActivateUserDto dto)
        {
            var user = await this._repo.GetByActivationTokenAsync(dto.ActivationToken);

            if (user == null)
                throw new BusinessRuleValidationException("Invalid or expired activation token.");

            if (!user.ValidateActivationToken(dto.ActivationToken))
                throw new BusinessRuleValidationException("Invalid or expired activation token.");

            if (user.IamUserId != dto.IamUserId)
                throw new BusinessRuleValidationException("User identity mismatch. Cannot activate.");

            user.Activate();

            await this._unitOfWork.CommitAsync();

            return ToDto(user);
        }

        public async Task<UserDto> DeactivateAsync(UserId id)
        {
            var user = await this._repo.GetUserByIdAsync(id);

            if (user == null)
                return null;

            user.Deactivate();

            await this._unitOfWork.CommitAsync();

            return ToDto(user);
        }

        public async Task<UserDto> ReactivateAsync(UserId id)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                return null;

            user.Activate();

            await this._unitOfWork.CommitAsync();

            return ToDto(user);
        }

        private UserDto ToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id.AsGuid(),
                Email = user.Email.Value,
                Name = user.Name.Value,
                Role = user.Role.Value,
                Status = user.Status.Value,
                IamUserId = user.IamUserId,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                ActivatedAt = user.ActivatedAt,
                HasPendingActivation = !string.IsNullOrEmpty(user.ActivationToken) && 
                                      user.ActivationTokenExpiry.HasValue && 
                                      user.ActivationTokenExpiry > DateTime.UtcNow
            };
        }
    }
}