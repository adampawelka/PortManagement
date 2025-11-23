using System;

// Asegúrate de que el namespace coincide con tu carpeta Shared
namespace DDDSample1.Domain.Shared
{
    public class EntityNotFoundException : Exception
    {
        public EntityNotFoundException()
        {
        }

        public EntityNotFoundException(string message)
            : base(message)
        {
        }

        public EntityNotFoundException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}