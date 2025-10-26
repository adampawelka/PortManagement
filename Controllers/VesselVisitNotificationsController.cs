using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;

using DDDSample1.Domain.Shared;
using DDDSample1.Domain.VesselVisitNotifications;
// Asegúrate de que este 'using' también existe para los DTOs de Dock
using DDDSample1.Domain.Docks; 

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VesselVisitNotificationsController : ControllerBase
    {
        // El servicio ya está FUSIONADO de los pasos anteriores
        private readonly VesselVisitNotificationService _service;

        public VesselVisitNotificationsController(VesselVisitNotificationService service)
        {
            _service = service;
        }

        // --- Endpoint GET (de 2.2.9) ---
        // GET: api/VesselVisitNotifications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VesselVisitNotificationDto>>> GetAll()
        {
            return Ok(await _service.GetAllNotificationsAsync());
        }

        // --- Endpoint GET por ID (de 2.2.9) ---
        // GET: api/VesselVisitNotifications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VesselVisitNotificationDto>> GetById(Guid id)
        {
            var vesselVisitNotification = await _service.GetNotificationByIdAsync(new VesselVisitNotificationId(id));

            if (vesselVisitNotification == null)
            {
                return NotFound();
            }

            return Ok(vesselVisitNotification);
        }
        
        // --- Endpoint POST (Crear) (de 2.2.9) ---
        // POST: api/VesselVisitNotifications
        [HttpPost]
        public async Task<ActionResult<VesselVisitNotificationDto>> CreateAsync(CreatingVesselVisitNotificationDto dto)
        {
            try
            {
                var vesselVisitNotification = await _service.AddVesselVisitNotificationAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = vesselVisitNotification.Id }, vesselVisitNotification);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // --- Endpoint PUT (Actualizar) (FUSIONADO) ---
        // (Lógica de 2.2.9, manejo de errores de 2.2.8)
        // PUT: api/VesselVisitNotifications/5
        [HttpPut("{id}")]
        public async Task<ActionResult<VesselVisitNotificationDto>> UpdateAsync(UpdatingVesselVisitNotificationDto dto, Guid id)
        {
            if (id != dto.Id)
            {
                return BadRequest(new { Message = "ID mismatch in URL and body."});
            }

            try
            {
                var vesselVisitNotification = await _service.UpdateVesselVisitNotificationAsync(dto, id);

                if (vesselVisitNotification == null)
                {
                    return NotFound(new { message = "Notification not found." });
                }
                return Ok(vesselVisitNotification);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex) // Ej. "Solo se puede modificar en InProgress"
            {
                return Conflict(new { message = ex.Message }); // 409 Conflict
            }
            catch (ArgumentException ex) // Ej. ID inválido
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // --- Endpoint POST (Submit) (de 2.2.9) ---
        //POST api/VesselVisitNotification/{id}/submit
        [HttpPost("{id}/submit")]
        public async Task<ActionResult<VesselVisitNotificationDto>> SubmitAsync(Guid id)
        {
            try
            {
                var vesselVisitNotification = await _service.SubmitVesselVisitNotificationAsync(id);

                if (vesselVisitNotification == null)
                {
                    return NotFound(new { Message = "Vessel Visit Notification not found." });
                }

                return Ok(vesselVisitNotification);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        // --- Endpoint POST (Approve) (FUSIONADO) ---
        // (Endpoint de 2.2.9, lógica de 2.2.8)
        //POST api/VesselVisitNotifications/{id}/approve
        [HttpPost("{id}/approve")]
        public async Task<ActionResult<VesselVisitNotificationDto>> ApproveAsync(Guid id, [FromBody] ApproveNotificationDto dto)
        {
            // 🚨 IMPORTANTE: Debes obtener el ID del oficial (officerId)
            // de la autenticación del usuario (ej. User.Identity).
            // Lo pongo "hardcoded" como ejemplo, pero DEBES cambiarlo.
            var officerId = Guid.NewGuid(); // <-- ¡CAMBIAR ESTO!

            try
            {
                // Llamamos al método FUSIONADO del servicio
                var vesselVisitNotification = await _service.ApproveVesselVisitNotificationAsync(id, dto, officerId);

                if (vesselVisitNotification == null)
                {
                    return NotFound(new { Message = "Vessel Visit Notification not found." });
                }

                return Ok(vesselVisitNotification);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex) 
            {
                return Conflict(new { message = ex.Message });
            }
            catch (ArgumentException ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // --- Endpoint POST (Reject) (FUSIONADO) ---
        // (Endpoint de 2.2.9, lógica de 2.2.8)
        //POST api/vesselvisits/{id}/reject
        [HttpPost("{id}/reject")]
        public async Task<ActionResult<VesselVisitNotificationDto>> RejectAsync(Guid id, [FromBody] RejectNotificationDto dto)
        {
            // 🚨 IMPORTANTE: Lo mismo que en Approve.
            // Debes obtener el ID del oficial de la autenticación.
            var officerId = Guid.NewGuid(); // <-- ¡CAMBIAR ESTO!

            try
            {
                // Llamamos al método FUSIONADO del servicio
                var vesselVisitNotification = await _service.RejectVesselVisitNotificationAsync(id, dto, officerId);

                if (vesselVisitNotification == null)
                {
                    return NotFound(new { Message = "Vessel Visit Notification not found." });
                }

                return Ok(vesselVisitNotification);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex) 
            {
                return Conflict(new { message = ex.Message });
            }
            catch (ArgumentException ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}