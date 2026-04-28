using Xunit;
using DDDSample1.Domain.VesselTypes;
using DDDSample1.Domain.Shared;

namespace BackendAPI.Tests.Domain.VesselTypes {
    
    public class OperationalConstraintsTest {
        [Fact]
        public void Constructor_WithValidData_ShouldCreateConstraints() {
            var constraints = new OperationalConstraints(10, 20, 5);

            Assert.Equal(10, constraints.MaxRows);
            Assert.Equal(20, constraints.MaxBays);
            Assert.Equal(5, constraints.MaxTiers);
        }

        [Fact]
        public void Constructor_WithZeroMaxRows_ShouldThrowException() {
            Assert.Throws<BusinessRuleValidationException>(
                () => new OperationalConstraints(0, 20, 5)
            );
        }

        [Fact]
        public void Constructor_WithNegativeMaxBays_ShouldThrowException() {
            Assert.Throws<BusinessRuleValidationException>(
                () => new OperationalConstraints(10, -1, 5)
            );
        }

        [Fact]
        public void Constructor_WithZeroMaxTiers_ShouldThrowException() {
            Assert.Throws<BusinessRuleValidationException>(
                () => new OperationalConstraints(10, 20, 0)
            );
        }
    }
}