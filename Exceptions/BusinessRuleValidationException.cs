namespace PortManagement.Exceptions
{
    public class BusinessRuleValidationException : Exception
    {
        public BusinessRuleValidationException() { }

        public BusinessRuleValidationException(string message) : base(message) { }

        public BusinessRuleValidationException(string message, Exception innerException) : base(message, innerException) { }
    }
}
