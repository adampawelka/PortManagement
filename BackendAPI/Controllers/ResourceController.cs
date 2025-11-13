
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Backend.Domain.Resources;
using Backend.Domain.Qualifications;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResourcesController : ControllerBase
    {
        private readonly ResourceService _service;

        public ResourcesController(ResourceService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<ResourceDto>>> GetAll()
        {
            try
            {
                var resources = await _service.GetAllAsync();
                return Ok(resources);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResourceDto>> GetById(Guid id)
        {
            try
            {
                var resource = await _service.GetByIdAsync(new ResourceId(id));
                if (resource == null)
                    return NotFound();

                return Ok(resource);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ResourceDto>> CreateAsync([FromBody] CreatingResourceDto dto)
        {
            try
            {
                var resource = await _service.AddAsync(
                    dto.Code,
                    dto.Description,
                    dto.Type,
                    dto.Capacity,
                    dto.Status,
                    dto.SetupTime
                );

                return CreatedAtAction(nameof(GetById), new { id = resource.Id.AsGuid() }, resource);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResourceDto>> UpdateAsync(Guid id, [FromBody] UpdatingResourceDto dto)
        {
            try
            {
                var updated = await _service.UpdateAsync(
                    new ResourceId(id),
                    dto.Description,
                    dto.Capacity,
                    dto.SetupTime
                );

                if (updated == null)
                    return NotFound();

                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ResourceDto>> ChangeStatus(Guid id, [FromBody] string newStatus)
        {
            try
            {
                var resource = await _service.ChangeStatusAsync(new ResourceId(id), newStatus);
                if (resource == null)
                    return NotFound();

                return Ok(resource);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("{id}/qualifications/{qualificationId}")]
        public async Task<ActionResult<ResourceDto>> AssignQualification(Guid id, Guid qualificationId)
        {
            try
            {
                var resource = await _service.AssignQualificationAsync(
                    new ResourceId(id),
                    new QualificationId(qualificationId.ToString())
                );
                if (resource == null)
                    return NotFound();

                return Ok(resource);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("{id}/qualifications/{qualificationId}")]
        public async Task<ActionResult<ResourceDto>> RemoveQualification(Guid id, Guid qualificationId)
        {
            try
            {
                var resource = await _service.RemoveQualificationAsync(
                    new ResourceId(id),
                    new QualificationId(qualificationId.ToString())
                );
                if (resource == null)
                    return NotFound();

                return Ok(resource);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
