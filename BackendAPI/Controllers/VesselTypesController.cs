using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.VesselTypes;
using Microsoft.AspNetCore.Authorization;

namespace DDDSample1.Controllers
{
    [Authorize] 
    [Route("api/[controller]")]
    [ApiController]
    public class VesselTypesController : ControllerBase
    {
        private readonly VesselTypeService _service;

        public VesselTypesController(VesselTypeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<VesselTypeDto>>> GetAll()
        {
            try
            {
                var vesselTypes = await _service.GetAllAsync();
                return Ok(vesselTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VesselTypeDto>> GetById(Guid id)
        {
            try
            {
                var vesselType = await _service.GetByIdAsync(id);
                if (vesselType == null)
                    return NotFound();
                
                return Ok(vesselType);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("search/name/{name}")]
        public async Task<ActionResult<List<VesselTypeDto>>> GetByName(string name)
        {
            try
            {
                var vesselTypes = await _service.GetByNameAsync(name);
                return Ok(vesselTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("search/description/{description}")]
        public async Task<ActionResult<List<VesselTypeDto>>> GetByDescription(string description)
        {
            try
            {
                var vesselTypes = await _service.GetByDescriptionAsync(description);
                return Ok(vesselTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("search/capacity")]
        public async Task<ActionResult<List<VesselTypeDto>>> GetByCapacityRange(
            [FromQuery] int minCapacity, 
            [FromQuery] int maxCapacity)
        {
            try
            {
                var vesselTypes = await _service.GetByCapacityRangeAsync(minCapacity, maxCapacity);
                return Ok(vesselTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<VesselTypeDto>>> Search(
            [FromQuery] string? name,
            [FromQuery] string? description,
            [FromQuery] int? minCapacity,
            [FromQuery] int? maxCapacity)
        {
            try
            {
                var vesselTypes = await _service.SearchAsync(name, description, minCapacity, maxCapacity);
                return Ok(vesselTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<VesselTypeDto>> Create([FromBody] CreatingVesselTypeDto dto)
        {
            try
            {
                var vesselType = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetById), new { id = vesselType.Id }, vesselType);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<VesselTypeDto>> Update(Guid id, [FromBody] UpdatingVesselTypeDto dto)
        {
            try
            {
                dto.Id = id;
                var vesselType = await _service.UpdateAsync(dto);
                if (vesselType == null)
                    return NotFound();
                
                return Ok(vesselType);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<VesselTypeDto>> Delete(Guid id)
        {
            try
            {
                var vesselType = await _service.DeleteAsync(id);
                if (vesselType == null)
                    return NotFound();
                
                return Ok(vesselType);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}