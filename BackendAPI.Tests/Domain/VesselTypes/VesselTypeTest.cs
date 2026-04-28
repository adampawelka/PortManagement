using Xunit;
using DDDSample1.Domain.VesselTypes;
using DDDSample1.Domain.Shared;

namespace BackendAPI.Tests.Domain.VesselTypes {
    
    public class VesselTypeTest {
        private OperationalConstraints ValidConstraints() {
            return new OperationalConstraints(10, 20, 5);
        }

        [Fact]
        public void Constructor_WithValidData_ShouldCreateVesselType() {
            var vesselType = new VesselType("BigVessel", "Correct", 45, ValidConstraints());

            Assert.Equal("BigVessel", vesselType.Name);
            Assert.Equal("Correct", vesselType.Description);
            Assert.Equal(45, vesselType.Capacity);
            Assert.NotNull(vesselType.Constraints);
        }

        [Fact]
        public void Constructor_WithEmptyName_ShouldThrow() {
            Assert.Throws<BusinessRuleValidationException>(
                () => new VesselType("", "NotCorrect", 45, ValidConstraints())
            );
        }

        [Fact]
        public void Constructor_WithEmptyDescription_ShouldThrow() {
            Assert.Throws<BusinessRuleValidationException>(
                () => new VesselType("BigVessel", "", 45, ValidConstraints())
            );
        }

        [Fact]
        public void Constructor_WithZeroCapacity_ShouldThrow() {
            Assert.Throws<BusinessRuleValidationException>(
                () => new VesselType("BigVessel", "NotCorrect", 0, ValidConstraints())
            );
        }

        [Fact]
        public void Constructor_WithNullConstraints_ShouldThrow() {
            Assert.Throws<BusinessRuleValidationException>(
                () => new VesselType("BigVessel", "NotCorrect", 45, null)
            );
        }

        [Fact]
        public void ChangeName_WithValidName_ShouldUpdateName() {
            var vt = new VesselType("OldName", "Description", 45, ValidConstraints());

            vt.ChangeName("NewName");

            Assert.Equal("NewName", vt.Name);
        }

        [Fact]
        public void ChangeName_WithEmptyName_ShouldThrow() {
            var vt = new VesselType("OldName", "Description", 45, ValidConstraints());

            Assert.Throws<BusinessRuleValidationException>(
                () => vt.ChangeName("")
            );
        }

        [Fact]
        public void ChangeCapacity_WithValidValue_ShouldUpdate() {
            var vt = new VesselType("BigVessel", "Description", 45, ValidConstraints());

            vt.ChangeCapacity(20);

            Assert.Equal(20, vt.Capacity);
        }

        [Fact]
        public void ChangeCapacity_WithZero_ShouldThrow() {
            var vt = new VesselType("BigVessel", "Description", 45, ValidConstraints());
            
            Assert.Throws<BusinessRuleValidationException>(
                () => vt.ChangeCapacity(0)
            );
        }
        
    }
}