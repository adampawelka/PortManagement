using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.StaffMembers;
using DDDSample1.Domain.Shared;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace DDDSample1.Controllers
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
                return CreatedAtAction(nameof(GetStaffMemberById), new { id = staffMemberDto.Id }, staffMemberDto);
            }
            catch (ArgumentException ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex) 
            {
                return Conflict(new { message = ex.Message }); 
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
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        // PUT: api/staffmembers/{id}/reactivate
        [HttpPut("{id}/reactivate")]
        public async Task<ActionResult<StaffMemberDto>> ReactivateStaffMember(Guid id)
        {
            try
            {
                var staffId = new StaffMemberId(id.ToString());
                var staffMemberDto = await _service.ReactivateStaffMemberAsync(staffId);
                return Ok(staffMemberDto);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<StaffMemberDto>> GetStaffMemberById(Guid id)
        {
            return Ok(new { Message = "Endpoint 'GetById' no implementado, pero necesario para CreatedAtAction." });
        }

        // GET: api/staffmembers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffMemberDto>>> GetAllStaffMembers()
        {
            var staffMembers = await _service.GetAllStaffMembersAsync();
            return Ok(staffMembers);
        }
    }
}