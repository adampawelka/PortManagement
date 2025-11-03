using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.VesselVisitNotifications
{
    public class VisitStatus : IValueObject
    {
        public string Value { get; private set; }

        private VisitStatus()
        {

        }

        public VisitStatus(string status)
        {
            if (string.IsNullOrEmpty(status))
                throw new BusinessRuleValidationException("Visit status cannot be empty.");

            if (!IsValidStatus(status))
                throw new BusinessRuleValidationException($"Invalid visit status: {status}");

            Value = status;
        }

        private bool IsValidStatus(string status)
        {
            return status == "InProgress" ||
            status == "Submitted" ||
            status == "Approved" ||
            status == "Rejected";
        }

        public static VisitStatus InProgress() => new VisitStatus("InProgress");
        public static VisitStatus Submitted() => new VisitStatus("Submitted");
        public static VisitStatus Approved() => new VisitStatus("Approved");
        public static VisitStatus Rejected() => new VisitStatus("Rejected");
    }
}