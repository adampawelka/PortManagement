using Microsoft.AspNetCore.Mvc;
using Backend.Domain.StaffMembers;
using Backend.Domain.Shared;
using System.Threading.Tasks;
using System;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffMembersController : ControllerBase
    {
        private readonly StaffMemberService _service;

        public StaffMembersController(StaffMemberService service)
        {
            _service = service;
        }

        // POST: api/staffmembers
        [HttpPost]
        public async Task<ActionResult<StaffMemberDto>> CreateStaffMember(CreateStaffMemberDto dto)
        {
            try
            {
                var staffMemberDto = await _service.CreateStaffMemberAsync(dto);
                // (Necesitarás un endpoint 'GetById' para que CreatedAtAction funcione)
                return CreatedAtAction(nameof(GetStaffMemberById), new { id = staffMemberDto.Id }, staffMemberDto);
            }
            catch (ArgumentException ex) // Ej. ID de cualificación inválido
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex) // Ej. Número mecanográfico duplicado
            {
                return Conflict(new { message = ex.Message }); // 409 Conflict
            }
        }

        // PUT: api/staffmembers/{id}/deactivate
        [HttpPut("{id}/deactivate")]
        public async Task<ActionResult<StaffMemberDto>> DeactivateStaffMember(Guid id)
        {
            try
            {
                var staffId = new StaffMemberId(id.ToString());
                var staffMemberDto = await _service.DeactivateStaffMemberAsync(staffId);
                return Ok(staffMemberDto);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex) // Ej. "Ya está inactivo"
            {
                return Conflict(new { message = ex.Message });
            }
        }
        
        // (Aquí iría el endpoint GET para que funcione CreatedAtAction)
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffMemberDto>> GetStaffMemberById(Guid id)
        {
            // (Esta lógica deberías implementarla en tu servicio)
            return Ok(new { Message = "Endpoint 'GetById' no implementado, pero necesario para CreatedAtAction." });
        }
    }
}