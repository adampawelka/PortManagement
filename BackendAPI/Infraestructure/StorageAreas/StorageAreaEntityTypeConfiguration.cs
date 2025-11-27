using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.StorageAreas;
using System.Text.Json;
using System.Collections.Generic;
using System;

namespace DDDSample1.Infrastructure.StorageAreas
{
    public class StorageAreaEntityTypeConfiguration : IEntityTypeConfiguration<StorageArea>
    {
        public void Configure(EntityTypeBuilder<StorageArea> builder)
        {
            builder.ToTable("StorageAreas", SchemaNames.DDDSample1);
            builder.HasKey(s => s.Id);

            builder.Property(s => s.Id)
                .HasConversion(
                    id => id.AsGuid(), 
                    value => new StorageAreaId(value) 
                )
                .HasColumnType("uuid");

            builder.Property(s => s.Type)
                .HasConversion(
                    type => type.Value, 
                    value => new StorageAreaType(value)
                )
                .HasColumnType("varchar(200)");

            builder.Property(s => s.Location)
                .HasConversion(
                    loc => loc.Value,  
                    value => new StorageAreaLocation(value)
                )
                .HasColumnType("text");

            builder.Property(s => s.MaxCapacity)
                .HasConversion(
                    cap => cap.Value,
                    value => new Capacity(value)
                )
                .HasColumnType("numeric");

            builder.Property(s => s.CurrentOccupancy)
                .HasConversion(
                    occ => occ.Value,
                    value => new Occupancy(value)
                )
                .HasColumnType("numeric");

            builder.Property(s => s.DockDistances)
                .HasConversion(
                    dict => JsonSerializer.Serialize(dict, (JsonSerializerOptions)null),
                    json => JsonSerializer.Deserialize<Dictionary<Guid, double>>(json, (JsonSerializerOptions)null)
                )
                .HasColumnType("jsonb");
        }
    }
}