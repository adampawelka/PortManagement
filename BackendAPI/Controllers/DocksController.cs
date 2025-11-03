using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;

using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Docks;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocksController : ControllerBase
    {
        private readonly DockService _service;

        public DocksController(DockService service)
        {
            _service = service;
        }

        // GET: api/Docks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DockDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/Docks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DockDto>> GetById(Guid id)
        {
            var dock = await _service.GetByIdAsync(new DockId(id));

            if (dock == null)
            {
                return NotFound();
            }

            return Ok(dock);
        }
        
        // GET: api/Docks?name=abc&location=xyz&vesselTypeId=guid
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<DockDto>>> GetFiltered(
            [FromQuery] string? name,
            [FromQuery] string? location,
            [FromQuery] Guid? vesselTypeId)
        {
            var docks = await _service.SearchAsync(name, location, vesselTypeId);
            return Ok(docks);
        }

        // POST: api/Docks
        [HttpPost]
        public async Task<ActionResult<DockDto>> CreateDockAsync(CreatingDockDto dto)
        {
            var dock = await _service.AddDockAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = dock.Id }, dock);
        }

        
        // PUT: api/Docks/5
        [HttpPut("{id}")]
        public async Task<ActionResult<DockDto>> UpdateDockAsync([FromBody] UpdatingDockDto dto, Guid id)
        {

            try
            {
                var dock = await _service.UpdateDockAsync(dto, id);
                
                if (dock == null)
                {
                    return NotFound();
                }
                return Ok(dock);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}

        