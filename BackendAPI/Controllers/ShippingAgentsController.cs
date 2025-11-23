using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.ShippingAgents;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Authorization;

namespace DDDSample1.Controllers
{
    [Authorize] 
    [Route("api/[controller]")]
    [ApiController]
    public class ShippingAgentsController : ControllerBase
    {
        private readonly ShippingAgentService _service;

        public ShippingAgentsController(ShippingAgentService service)
        {
            _service = service;
        }

        [HttpPost]
        [SwaggerOperation(Summary = "Register a new shipping agent organization (US06)")]
        [SwaggerResponse(201, "Organization created", typeof(ShippingAgentOrganizationDto))]
        [SwaggerResponse(400, "Invalid input")]
        public async Task<ActionResult<ShippingAgentOrganizationDto>> Register(
            [FromBody] CreatingShippingAgentOrganizationDto dto)
        {
            try
            {
                var organization = await _service.RegisterOrganizationAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = organization.Id }, organization);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet]
        [SwaggerOperation(Summary = "Get all shipping agent organizations")]
        [SwaggerResponse(200, "List of organizations", typeof(List<ShippingAgentOrganizationDto>))]
        public async Task<ActionResult<List<ShippingAgentOrganizationDto>>> GetAll()
        {
            try
            {
                var organizations = await _service.GetAllAsync();
                return Ok(organizations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Get organization by ID")]
        [SwaggerResponse(200, "Organization found", typeof(ShippingAgentOrganizationDto))]
        [SwaggerResponse(404, "Organization not found")]
        public async Task<ActionResult<ShippingAgentOrganizationDto>> GetById(string id)
        {
            try
            {
                var organization = await _service.GetByIdAsync(id);
                if (organization == null)
                    return NotFound(new { error = "Organization not found" });

                return Ok(organization);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
        [HttpGet("representatives/{representativeId}")]
        [SwaggerOperation(Summary = "Get representative by ID (US09)")]
        [SwaggerResponse(200, "Representative found", typeof(ShippingAgentRepresentativeDto))]
        [SwaggerResponse(404, "Representative not found")]
        public async Task<ActionResult<ShippingAgentRepresentativeDto>> GetRepresentativeById(string representativeId)
        {
            try
            {
                var representative = await _service.GetRepresentativeByIdAsync(representativeId);
                if (representative == null)
                    return NotFound(new { error = "Representative not found" });
                
                return Ok(representative);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("{id}/representatives")]
        [SwaggerOperation(Summary = "Add a new representative to an organization (US07 - Create)")]
        [SwaggerResponse(201, "Representative added", typeof(ShippingAgentOrganizationDto))]
        [SwaggerResponse(404, "Organization not found")]
        [SwaggerResponse(400, "Invalid input")]
        public async Task<ActionResult<ShippingAgentOrganizationDto>> AddRepresentative(
            string id, 
            [FromBody] CreatingShippingAgentRepresentativeDto dto)
        {
            try
            {
                var organization = await _service.AddRepresentativeAsync(id, dto);
                return Ok(organization);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPut("representatives/{repId}")]
        [SwaggerOperation(Summary = "Update a representative's information by ID (US07 - Update)")]
        [SwaggerResponse(200, "Representative updated", typeof(ShippingAgentRepresentativeDto))]
        [SwaggerResponse(404, "Representative not found")]
        [SwaggerResponse(400, "Invalid input")]
        public async Task<ActionResult<ShippingAgentRepresentativeDto>> UpdateRepresentative(
            string repId,
            [FromBody] CreatingShippingAgentRepresentativeDto dto)
        {
            try
            {
                var representative = await _service.UpdateRepresentativeAsync(repId, dto);
                return Ok(representative);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpDelete("{orgId}/representatives/{repId}")]
        [SwaggerOperation(Summary = "Deactivate (remove) a representative from an organization (US07 - Deactivate)")]
        [SwaggerResponse(200, "Representative deactivated")]
        [SwaggerResponse(404, "Organization or representative not found")]
        [SwaggerResponse(400, "Cannot deactivate last representative")]
        public async Task<ActionResult> DeactivateRepresentative(string orgId, string repId)
        {
            try
            {
                var success = await _service.DeactivateRepresentativeAsync(orgId, repId);
                if (!success)
                    return NotFound(new { error = "Organization or representative not found" });
                
                return Ok(new { message = "Representative deactivated successfully" });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}