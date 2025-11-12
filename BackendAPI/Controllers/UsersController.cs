using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// endpoints used by Administrator pass 'Guid id' and endpoints used by SPA while authentication pass 'string id' to the service
namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _service;

        public UsersController(UserService service)
        {
            _service = service;
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
            var users = await _service.GetAllAsync();
            return Ok(users);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        // [Authorize]
        public async Task<ActionResult<UserDto>> GetById(Guid id)
        {
            var user = await _service.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // needed for SPA permissions
        // GET: api/Users/{auth0|...}/role-status}
        [HttpGet("{id}/role-status")]
        public async Task<ActionResult<UserRoleStatusDto>> GetRoleStatus(string id)
        {
            var user = await _service.GetByIamUserIdAsync(id);

            if (user == null)
            {
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
                var user = await _service.AssignRoleAsync(new UserId(id), role);

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
                var token = await _service.GenerateActivationTokenAsync(new UserId(id));
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
                var user = await _service.DeactivateAsync(new UserId(id));

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
                var user = await _service.ReactivateAsync(new UserId(id));

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
    }
}