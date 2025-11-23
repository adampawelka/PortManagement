using Backend.Domain.Shared;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Domain.VesselVisitNotifications
{
    public class CargoManifest : IValueObject
    {
        public string ManifestType { get; private set; }
        public List<ContainerIdentifier> Containers { get; private set; }

        private CargoManifest()
        {
        }

        public CargoManifest(string manifestType, List<ContainerIdentifier> containers)
        {
            if (string.IsNullOrEmpty(manifestType))
                throw new BusinessRuleValidationException("Manifest type cannot be empty.");
            if (manifestType != "Loading" && manifestType != "Unloading")
                throw new BusinessRuleValidationException("Manifest type must be 'Loading' or 'Unloading'.");

            if (containers == null || !containers.Any())
                throw new BusinessRuleValidationException("Cargo manifest must contain at least one container.");

            ManifestType = manifestType;
            Containers = containers;
        }
    }
}