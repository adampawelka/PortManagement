using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Infrastructure.Shared
{
    // Esta implementación debe ir en la capa de Infraestructura, ya que maneja detalles técnicos (SMTP).
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _senderEmail;
        private readonly bool _enableSsl;

        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
            
            // Cargar la configuración desde appsettings.json
            _smtpServer = _configuration["EmailSettings:SmtpServer"];
            _smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
            _smtpUsername = _configuration["EmailSettings:SmtpUsername"];
            _smtpPassword = _configuration["EmailSettings:SmtpPassword"];
            _senderEmail = _configuration["EmailSettings:SenderEmail"];
            _enableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"] ?? "true");
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message, bool isHtml = true)
        {
            if (string.IsNullOrEmpty(_smtpUsername) || string.IsNullOrEmpty(_smtpPassword))
            {
                System.Console.WriteLine("Advertencia: EmailSender no configurado. Correo no enviado.");
                return; // Evita fallos si no hay credenciales
            }

            using (var client = new SmtpClient(_smtpServer, _smtpPort))
            {
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
                client.EnableSsl = _enableSsl;
                
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_senderEmail),
                    Subject = subject,
                    Body = message,
                    IsBodyHtml = isHtml
                };

                mailMessage.To.Add(toEmail);

                try
                {
                    // ESTA ES LA LÍNEA QUE PUEDE FALLAR SI LAS CREDENCIALES O EL PUERTO SON INCORRECTOS
                    await client.SendMailAsync(mailMessage);
                    System.Console.WriteLine($"[EMAIL SUCCESS] Correo de activación enviado a {toEmail}.");
                }
                catch (SmtpException ex)
                {
                    // Este log es VITAL para el diagnóstico
                    System.Console.WriteLine($"[EMAIL FAILED] Error SMTP al enviar correo a {toEmail}: {ex.Message}");
                    throw new BusinessRuleValidationException("Fallo al enviar el correo de activación. Revise la configuración SMTP en el Backend.");
                }
            }
        }
    }
}