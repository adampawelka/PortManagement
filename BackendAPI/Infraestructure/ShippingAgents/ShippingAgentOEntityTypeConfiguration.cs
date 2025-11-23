using Backend.Domain.ShippingAgents;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Infrastructure.ShippingAgents
{
    public class ShippingAgentOEntityTypeConfiguration : IEntityTypeConfiguration<ShippingAgentOrganization>
    {
        public void Configure(EntityTypeBuilder<ShippingAgentOrganization> builder)
        {
            builder.ToTable("ShippingAgentOrganizations", SchemaNames.DDDSample1);

            // Primary Key
            builder.HasKey(b => b.Id);

            // Configure ID conversion
            builder.Property(b => b.Id)
                .HasConversion(
                    id => id.AsString(),
                    value => new ShippingAgentOrganizationId(value))
                .HasColumnName("Id");

            // Configure Value Objects - Map directly to columns
            builder.Property(b => b.LegalName)
                .HasConversion(
                    ln => ln.Value,
                    value => new LegalName(value))
                .HasColumnName("LegalName")
                .IsRequired();

            builder.Property(b => b.Address)
                .HasConversion(
                    addr => addr.Value,
                    value => new Address(value))
                .HasColumnName("Address")
                .IsRequired();

            builder.Property(b => b.TaxNumber)
                .HasConversion(
                    tax => tax.Value,
                    value => new TaxNumber(value))
                .HasColumnName("TaxNumber")
                .IsRequired();

            // Alternative Names - Ignore for now, or use JSON
            builder.Ignore(b => b.AlternativeNames);

            // Representatives as related entities
            builder.HasMany(b => b.Representatives)
                .WithOne()
                .HasForeignKey("ShippingAgentOrganizationId")
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}