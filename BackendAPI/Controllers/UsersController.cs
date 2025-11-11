using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Infrastructure;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize] // Require authentication for all endpoints
    public class UsersController : ControllerBase
    {
        private readonly DDDSample1DbContext _context;

        public UsersController(DDDSample1DbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            var users = await _context.Users.ToListAsync();
            
            return Ok(users.Select(u => new
            {
                Id = u.Id.AsGuid(),
                Email = u.Email.Value,
                Name = u.Name.Value,
                Role = u.Role.Value,
                Status = u.Status.Value,
                IamUserId = u.IamUserId,
                CreatedAt = u.CreatedAt,
                HasPendingActivation = !string.IsNullOrEmpty(u.ActivationToken) && 
                                      u.ActivationTokenExpiry.HasValue && 
                                      u.ActivationTokenExpiry > DateTime.UtcNow
            }));
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetById(Guid id)
        {
            var user = await _context.Users.FindAsync(new UserId(id));

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                Id = user.Id.AsGuid(),
                Email = user.Email.Value,
                Name = user.Name.Value,
                Role = user.Role.Value,
                Status = user.Status.Value,
                IamUserId = user.IamUserId
            });
        }

        // PUT: api/Users/5/role
        [HttpPut("{id}/role")]
        public async Task<ActionResult> AssignRole(Guid id, [FromBody] string role)
        {
            var user = await _context.Users.FindAsync(new UserId(id));

            if (user == null)
            {
                return NotFound();
            }

            try
            {
                user.AssignRole(new UserRole(role));
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Role assigned successfully",
                    Role = role
                });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // POST: api/Users/5/activation-token
        [HttpPost("{id}/activation-token")]
        public async Task<ActionResult> GenerateActivationToken(Guid id)
        {
            var user = await _context.Users.FindAsync(new UserId(id));

            if (user == null)
            {
                return NotFound();
            }

            try
            {
                var token = user.GenerateActivationToken();
                await _context.SaveChangesAsync();

                // TODO: Send email with activation link
                Console.WriteLine($"Activation token for {user.Email.Value}: {token}");
                Console.WriteLine($"Activation link: http://localhost:5173/activate?token={token}");

                return Ok(new
                {
                    Message = "Activation token generated and email sent",
                    Token = token // Remove this in production
                });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // PUT: api/Users/5/deactivate
        [HttpPut("{id}/deactivate")]
        public async Task<ActionResult> Deactivate(Guid id)
        {
            var user = await _context.Users.FindAsync(new UserId(id));

            if (user == null)
            {
                return NotFound();
            }

            try
            {
                user.Deactivate();
                await _context.SaveChangesAsync();

                return Ok(new { Message = "User deactivated successfully" });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // PUT: api/Users/5/reactivate
        [HttpPut("{id}/reactivate")]
        public async Task<ActionResult> Reactivate(Guid id)
        {
            var user = await _context.Users.FindAsync(new UserId(id));

            if (user == null)
            {
                return NotFound();
            }

            try
            {
                user.Activate();
                await _context.SaveChangesAsync();

                return Ok(new { Message = "User reactivated successfully" });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}