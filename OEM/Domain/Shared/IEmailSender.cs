using System.Threading.Tasks;

namespace DDDSample1.Domain.Shared
{
    // Define la interfaz para el servicio de envío de correos. 
    // Lo ponemos en Domain.Shared para que sea accesible por UserService.
    public interface IEmailSender
    {
        Task SendEmailAsync(string toEmail, string subject, string message, bool isHtml = true);
    }
}