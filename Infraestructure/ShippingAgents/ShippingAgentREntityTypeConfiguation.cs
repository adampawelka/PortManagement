using DDDSample1.Domain.ShippingAgents;
using DDDSample1.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.ShippingAgents
{
    public class ShippingAgentREntityTypeConfiguration : IEntityTypeConfiguration<ShippingAgentRepresentative>
    {
        public void Configure(EntityTypeBuilder<ShippingAgentRepresentative> builder)
        {
            builder.ToTable("ShippingAgentRepresentatives", SchemaNames.DDDSample1);

            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id)
                .HasConversion(
                    id => id.AsString(),
                    value => new ShippingAgentRepresentativeId(value));

            // Value Objects as Owned Types
            builder.OwnsOne(b => b.Name, name =>
            {
                name.Property(x => x.Value)
                    .HasColumnName("Name")
                    .IsRequired();
            });

            builder.OwnsOne(b => b.CitizenId, cid =>
            {
                cid.Property(x => x.Value)
                    .HasColumnName("CitizenId")
                    .IsRequired();
            });

            builder.OwnsOne(b => b.Nationality, nat =>
            {
                nat.Property(x => x.Value)
                    .HasColumnName("Nationality")
                    .IsRequired();
            });

            builder.OwnsOne(b => b.Email, email =>
            {
                email.Property(x => x.Value)
                    .HasColumnName("Email")
                    .IsRequired();
            });

            builder.OwnsOne(b => b.Phone, phone =>
            {
                phone.Property(x => x.Value)
                    .HasColumnName("Phone")
                    .IsRequired();
            });
        }
    }
}