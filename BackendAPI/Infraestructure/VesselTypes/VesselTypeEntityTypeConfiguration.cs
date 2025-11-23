using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.VesselTypes;

namespace DDDSample1.Infrastructure.VesselTypes
{
    internal class VesselTypeEntityTypeConfiguration : IEntityTypeConfiguration<VesselType>
    {
        public void Configure(EntityTypeBuilder<VesselType> builder)
        {
            builder.ToTable("VesselTypes", SchemaNames.DDDSample1);
            builder.HasKey(b => b.Id);

            builder.Property(vt => vt.Id)
                .HasConversion(
                    id => id.AsGuid(),  
                    value => new VesselTypeId(value) 
                )
                .HasColumnType("uuid")
                .IsRequired();

            builder.Property(vt => vt.Name)
                .IsRequired()  
                .HasMaxLength(500);
           
            builder.Property(vt => vt.Description)
                .IsRequired()
                .HasMaxLength(500);
           
            builder.Property(vt => vt.Capacity)  
                .IsRequired();

            builder.OwnsOne(vt => vt.Constraints, constraintsBuilder =>
            {
                constraintsBuilder.Property(c => c.MaxRows)
                    .HasColumnName("MaxRows")
                    .IsRequired();
               
                constraintsBuilder.Property(c => c.MaxBays)
                    .HasColumnName("MaxBays")
                    .IsRequired();
               
                constraintsBuilder.Property(c => c.MaxTiers)
                    .HasColumnName("MaxTiers")
                    .IsRequired();
            });
        }
    }
}