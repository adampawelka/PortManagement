using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Vessels;

namespace DDDSample1.Infrastructure.Vessels
{
    internal class VesselEntityTypeConfiguration : IEntityTypeConfiguration<Vessel>
    {
        public void Configure(EntityTypeBuilder<Vessel> builder)
        {
            builder.ToTable("Vessels", SchemaNames.DDDSample1);
            builder.HasKey(b => b.Id);

            builder.Property(v => v.Id)
            .HasConversion(
            id => id.AsGuid(),          // to database
            value => new VesselId(value) // from database
            );
            
            builder.OwnsOne(v => v.IMO, imo =>
            {
                imo.Property(i => i.Value)
                   .HasColumnName("IMO")
                   .IsRequired();
            });

            builder.OwnsOne(v => v.VesselName, imo =>
            {
                imo.Property(i => i.Value)
                   .HasColumnName("VesselName")
                   .IsRequired();
            });

            // Configure shadow foreign key for Owner
            builder.HasOne(v => v.Owner)
                   .WithMany() // if you don't want a collection in Owner
                   .HasForeignKey("OwnerId")
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Restrict);

            // Configure shadow foreign key for VesselType
            builder.HasOne(v => v.VesselType)
                   .WithMany() // if VesselType has no navigation collection
                   .HasForeignKey("VesselTypeId")
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Restrict);
            
        }
    }
}