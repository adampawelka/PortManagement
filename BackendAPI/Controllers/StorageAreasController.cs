using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Backend.Domain.StorageAreas;
using Backend.Domain.Shared;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StorageAreasController : ControllerBase
    {
        private readonly StorageAreaService _storageAreaService;

        public StorageAreasController(StorageAreaService storageAreaService)
        {
            _storageAreaService = storageAreaService;
        }

        // GET: api/storageareas
        [HttpGet]
        public async Task<ActionResult<List<StorageAreaDto>>> GetAll()
        {
            try
            {
                var storageAreas = await _storageAreaService.GetAllAsync();
                return Ok(storageAreas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/storageareas/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StorageAreaDto>> GetById(Guid id)
        {
            try
            {
                var storageArea = await _storageAreaService.GetByIdAsync(new StorageAreaId(id));
                if (storageArea == null)
                    return NotFound($"Storage area with ID {id} not found.");

                return Ok(storageArea);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/storageareas
        [HttpPost]
        public async Task<ActionResult<StorageAreaDto>> Create([FromBody] CreateStorageAreaDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var storageArea = await _storageAreaService.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = storageArea.Id }, storageArea);
            }
            catch (BusinessRuleValidationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/storageareas/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<StorageAreaDto>> Update(Guid id, [FromBody] UpdateStorageAreaDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var storageArea = await _storageAreaService.UpdateAsync(dto, id);
                if (storageArea == null)
                    return NotFound($"Storage area with ID {id} not found.");

                return Ok(storageArea);
            }
            catch (BusinessRuleValidationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/storageareas/{id}/occupancy
        [HttpPut("{id}/occupancy")]
        public async Task<ActionResult<StorageAreaDto>> UpdateOccupancy(Guid id, [FromBody] UpdateOccupancyDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var storageArea = await _storageAreaService.UpdateOccupancyAsync(dto, id);
                if (storageArea == null)
                    return NotFound($"Storage area with ID {id} not found.");

                return Ok(storageArea);
            }
            catch (BusinessRuleValidationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/storageareas/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<StorageAreaDto>> Delete(Guid id)
        {
            try
            {
                var storageArea = await _storageAreaService.DeleteAsync(new StorageAreaId(id));
                if (storageArea == null)
                    return NotFound($"Storage area with ID {id} not found.");

                return Ok(storageArea);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}