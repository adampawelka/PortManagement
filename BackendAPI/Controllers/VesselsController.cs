using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Backend.Domain.Vessels;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VesselsController : ControllerBase
    {
        private readonly VesselService _service;

        public VesselsController(VesselService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<VesselDto>>> GetAll()
        {
            try
            {
                var vessels = await _service.GetAllVesselsAsync();
                return Ok(vessels);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VesselDto>> GetById(Guid id)
        {
            try
            {
                var vessel = await _service.GetVesselByIdAsync(id);
                if (vessel == null)
                    return NotFound();

                return Ok(vessel);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // GET: api/Docks?name=abc&location=xyz&vesselTypeId=guid
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<VesselDto>>> GetFiltered(
            [FromQuery] string? imo,
            [FromQuery] string? name,
            [FromQuery] Guid? ownerId)
        {
            try
            {
                var vessels = await _service.SearchAsync(imo, name, ownerId);
                return Ok(vessels);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        [HttpPost]
        public async Task<ActionResult<VesselDto>> CreateAsync(CreatingVesselDto dto)
        {
            try
            {
                var vessel = await _service.AddVesselAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = vessel.Id }, vessel);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<VesselDto>> UpdateAsync(Guid id, UpdatingVesselDto dto)
        {
            try
            {
                var vessel = await _service.UpdateVesselAsync(id, dto);
                if (vessel == null)
                    return NotFound();

                return Ok(vessel);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

    }

    
}