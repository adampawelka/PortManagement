using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

// endpoints used by Administrator pass 'Guid id' and endpoints used by SPA while authentication pass 'string id' to the service
namespace DDDSample1.Controllers
{
    [Authorize] 
    [Route("api/[controller]")]
    [ApiController]
    public class PendingUsersController : ControllerBase
    {
        private readonly PendingUserService _service;

        public PendingUsersController(PendingUserService service)
        {
            _service = service;
        }

         // GET api/PendingUsers
        [HttpGet()]
        public async Task<ActionResult<IEnumerable<PendingUserDto>>> GetAllPendingUsers()
        {
            var pendingUsers = await _service.GetAllAsync();
            return Ok(pendingUsers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PendingUserDto>> GetPendingUserById(Guid id)
        {
            var user = await _service.GetPendingUserByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("iam/{iam}")]
        public async Task<ActionResult<PendingUserDto>> GetPendingUserByIamId(string iam)
        {
            var user = await _service.GetPendingUserByIamIdAsync(iam);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost()]
        public async Task<ActionResult<PendingUserDto>> CreatePendingUser(CreatingPendingUserDto dto)
        {
            var pendingUser = await _service.AddPendingUserAsync(dto);

            return CreatedAtAction(nameof(GetPendingUserById), new { id = pendingUser.Id }, pendingUser);
        }

        // DELETE: api/PendingUsers/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePendingUser(Guid id)
        {
            var deleted = await _service.RemovePendingUserAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }


    }
}