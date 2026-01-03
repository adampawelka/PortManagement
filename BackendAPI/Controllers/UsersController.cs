using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims; 

// endpoints used by Administrator pass 'Guid id' and endpoints used by SPA while authentication pass 'string id' to the service
namespace DDDSample1.Controllers
{
    [Authorize] 
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly PendingUserService _pendingUserService;

        public UsersController(UserService userService, PendingUserService pendingUserService)
        {
            _userService = userService;
            _pendingUserService = pendingUserService;
        }

        public class UserRoleStatusDto
        {
            public string Role { get; set; }
            public string Status { get; set; }
        }

        // GET: api/Users
        [HttpGet]
        // [Authorize] // Require authentication
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        // [Authorize]
        public async Task<ActionResult<UserDto>> GetUserById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

       // needed for SPA permissions
// GET: api/Users/iam/{iam}/role-status
        [HttpGet("iam/{iam}/role-status")]
        public async Task<ActionResult<UserRoleStatusDto>> GetRoleStatus(string iam, string email, string name)
        {
            var user = await _userService.GetUserByIamIdAsync(iam);

            if (user == null)
            {
                var pending = await _pendingUserService.GetPendingUserByIamIdAsync(iam);
                if (pending == null)
                {
                    var pendEmail = email ?? "unknown@unknown.com";
                    var pendName = name ?? "Unknown User";

                    await _pendingUserService.AddPendingUserAsync(new CreatingPendingUserDto
                    {
                        Email = pendEmail,
                        Name = pendName,
                        IamUserId = iam,
                    });
                }

                return NotFound();
            }

            var result = new UserRoleStatusDto
            {
                Role = user.Role,
                Status = user.Status
            };

            return Ok(result);
        }


        // PUT: api/Users/5/role
        [HttpPut("{id}/role")]
        // [Authorize]
        public async Task<ActionResult<UserDto>> AssignRole(string id, [FromBody] string role)
        {
            try
            {
                var user = await _userService.AssignRoleAsync(new UserId(id), role);

                if (user == null)
                {
                    return NotFound();
                }

                return Ok(user);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // POST: api/Users/5/activation-token
        [HttpPost("{id}/activation-token")]
        // [Authorize]
        public async Task<ActionResult> GenerateActivationToken(string id)
        {
            try
            {
                var token = await _userService.GenerateActivationTokenAsync(new UserId(id));
                return Ok(new { Message = "Activation email sent", Token = token });
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // PUT: api/Users/5/deactivate
        [HttpPut("{id}/deactivate")]
        // [Authorize]
        public async Task<ActionResult<UserDto>> Deactivate(Guid id)
        {
            try
            {
                var user = await _userService.DeactivateAsync(new UserId(id));

                if (user == null)
                {
                    return NotFound();
                }

                return Ok(user);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // PUT: api/Users/5/reactivate
        [HttpPut("{id}/reactivate")]
        // [Authorize]
        public async Task<ActionResult<UserDto>> Reactivate(Guid id)
        {
            try
            {
                var user = await _userService.ReactivateAsync(new UserId(id));

                if (user == null)
                {
                    return NotFound();
                }

                return Ok(user);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        
        // POST: api/Users/activate
        
        [HttpPost("activate")]
        [AllowAnonymous] // Permite entrar sin estar logueado
        public async Task<ActionResult<UserDto>> ActivateUser([FromBody] ActivateUserDto dto)
        {
            // EXPLICACIÓN: Eliminamos el chequeo de "User.FindFirstValue" porque 
            // el usuario que viene del email NO tiene una sesión activa todavía.

            // 1. Validación básica del DTO
            if (dto == null || string.IsNullOrEmpty(dto.ActivationToken))
            {
                return BadRequest(new { Message = "El token de activación es requerido." });
            }

            try
            {
                // 2. Llamamos al servicio. 
                // El servicio debe buscar al usuario por su 'ActivationToken' (o IamUserId + Token)
                // y verificar que el token sea válido y no haya expirado.
                var userDto = await _userService.ActivateAsync(dto);
                
                return Ok(userDto);
            }
            catch (BusinessRuleValidationException ex)
            {
                // Ejemplo: "El token ha expirado" o "Usuario ya activado"
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error interno: {ex.Message}" });
            }
        }

       [HttpPost("create")]
        public async Task<ActionResult<UserDto>> CreateUserAsync(CreatingUserDto dto)
        {
            var user = await _userService.AddUserAsync(dto);

            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }
    }
}