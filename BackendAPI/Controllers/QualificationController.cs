using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Qualifications;
using Microsoft.AspNetCore.Authorization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class QualificationsController : ControllerBase
    {
        private readonly QualificationService _service;

        public QualificationsController(QualificationService service)
        {
            _service = service;
        }

        // GET: api/qualifications
        [HttpGet]
        public async Task<ActionResult<List<QualificationDto>>> GetAll()
        {
            try
            {
                var qualifications = await _service.GetAllAsync();
                return Ok(qualifications);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // GET: api/qualifications/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<QualificationDto>> GetById(Guid id)
        {
            try
            {
                var qualification = await _service.GetByIdAsync(new QualificationId(id.ToString()));
                if (qualification == null)
                    return NotFound();

                return Ok(qualification);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // POST: api/qualifications
        [HttpPost]
        public async Task<ActionResult<QualificationDto>> CreateAsync([FromBody] CreatingQualificationDto dto)
        {
            try
            {
                var qualification = await _service.AddAsync(dto.Code, dto.Name);
                return CreatedAtAction(nameof(GetById), new { id = qualification.Id }, qualification);
            }
            catch (BusinessRuleValidationException ex)
            {
                return Conflict(new { Message = ex.Message }); 
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // PUT: api/qualifications/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<QualificationDto>> UpdateAsync(Guid id, [FromBody] UpdatingQualificationDto dto)
        {
            try
            {
                var updated = await _service.UpdateAsync(new QualificationId(id.ToString()), dto.Code, dto.Name);
                if (updated == null)
                    return NotFound();

                return Ok(updated);
            }
            catch (BusinessRuleValidationException ex)
            {
                return Conflict(new { Message = ex.Message }); 
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // GET: api/qualifications/search?code=abc&name=xyz
        [HttpGet("search")]
        public async Task<ActionResult<List<QualificationDto>>> Search([FromQuery] string? code, [FromQuery] string? name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(code) && string.IsNullOrWhiteSpace(name))
                    return BadRequest(new { Message = "At least one search parameter (code or name) must be provided." });

                var results = await _service.SearchAsync(code, name);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
