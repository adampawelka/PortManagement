using System.Collections.Generic; 

namespace DDDSample1.Domain.VesselVisitNotifications
{
    public class CargoManifestDto
    {
        public string ManifestType { get; set; }
        public List<string> ContainerIdentifiers{ get; set; }

        public CargoManifestDto(string manifestType, List<string> containerIdentifiers)
        {
            ManifestType = manifestType;
            ContainerIdentifiers = containerIdentifiers;
        }
    }
}