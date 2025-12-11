using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OEMApi.Domain.Incidents;

namespace OEMApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncidentsController : ControllerBase
    {
        private readonly IncidentService _service;

        public IncidentsController(IncidentService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<Incident>> Create(CreateIncidentDto dto)
        {
            var incident = await _service.CreateIncidentAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = incident.Id }, incident);
        }

        [HttpGet]
        public async Task<ActionResult<List<Incident>>> GetAll()
        {
            return await _service.GetAllIncidentsAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Incident>> GetById(string id)
        {
            // Simple get implementation would normally go through Service too
            return Ok(); 
        }
    }
}