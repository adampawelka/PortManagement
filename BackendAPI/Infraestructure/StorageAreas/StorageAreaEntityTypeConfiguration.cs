using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Backend.Domain.StorageAreas;

namespace Backend.Infrastructure.StorageAreas
{
    internal class StorageAreaEntityTypeConfiguration : IEntityTypeConfiguration<StorageArea>
    {
        public void Configure(EntityTypeBuilder<Domain.StorageAreas.StorageArea> builder)
        {
            builder.HasKey(x => x.Id);

            // Configure Type as owned entity
            builder.OwnsOne(x => x.Type, sa =>
            {
                sa.Property(p => p.Value)
                    .IsRequired()
                    .HasColumnName("Type")
                    .HasMaxLength(50);
            });

            // Configure Location as owned entity
            builder.OwnsOne(x => x.Location, sa =>
            {
                sa.Property(p => p.Value)
                    .IsRequired()
                    .HasColumnName("Location")
                    .HasMaxLength(200);
            });

            // Configure MaxCapacity as owned entity
            builder.OwnsOne(x => x.MaxCapacity, sa =>
            {
                sa.Property(p => p.Value)
                    .IsRequired()
                    .HasColumnName("MaxCapacityTEU");
            });

            // Configure CurrentOccupancy as owned entity
            builder.OwnsOne(x => x.CurrentOccupancy, sa =>
            {
                sa.Property(p => p.Value)
                    .IsRequired()
                    .HasColumnName("CurrentOccupancyTEU");
            });

            // Store DockDistances as JSON - this is a regular property, not an owned entity
            builder.Property<Dictionary<Guid, double>>("DockDistances")
                .HasColumnName("DockDistances")
                .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<Dictionary<Guid, double>>(v) ?? new Dictionary<Guid, double>()
                )
                .IsRequired();
        }
    }
}