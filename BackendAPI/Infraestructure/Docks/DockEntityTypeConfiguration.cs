using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Docks;
using DDDSample1.Domain.VesselTypes;
using System.Collections.Generic;

namespace DDDSample1.Infrastructure.Docks
{
    internal class DockEntityTypeConfiguration : IEntityTypeConfiguration<Dock>
    {
        public void Configure(EntityTypeBuilder<Dock> builder)
        {
            builder.ToTable("Docks", SchemaNames.DDDSample1);
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id)
            .HasConversion(
            id => id.AsGuid(), 
            value => new DockId(value) 
            )
            .HasColumnType("uuid")  
            .IsRequired();
            
            builder.OwnsOne(x => x.DockName, n =>
            {
                n.Property(v => v.Value)
                 .HasColumnName("DockName")
                 .HasMaxLength(100)
                 .IsRequired();
            });

            builder.OwnsOne(x => x.DockLocation, t =>
            {
                t.Property(t => t.Value)
                 .HasColumnName("DockLocation")
                 .IsRequired();
            });

            builder.OwnsOne(x => x.Depth, d =>
            {
                d.Property(v => v.Value)
                 .HasColumnName("Depth")
                 .HasColumnType("float")
                 .IsRequired();
            });

            builder.OwnsOne(x => x.Length, l =>
            {
                l.Property(v => v.Value)
                 .HasColumnName("Length")
                 .HasColumnType("float")
                 .IsRequired();
            });

            builder.OwnsOne(x => x.MaxDraft, m =>
            {
                m.Property(v => v.Value)
                 .HasColumnName("MaxDraft")
                 .HasColumnType("float")
                 .IsRequired();
            });

            builder
                .HasMany(d => d.AllowedVesselTypes)
                .WithMany() // assuming VesselType has no navigation property to Dock
                .UsingEntity<Dictionary<string, object>>(
                    "DockAllowedVesselTypes",
                    j => j.HasOne<VesselType>().WithMany().HasForeignKey("VesselTypeId").OnDelete(DeleteBehavior.Cascade),
                    j => j.HasOne<Dock>().WithMany().HasForeignKey("DockId").OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.ToTable("DockAllowedVesselTypes");
                        j.HasKey("DockId", "VesselTypeId");
                    });

        }

    }
}