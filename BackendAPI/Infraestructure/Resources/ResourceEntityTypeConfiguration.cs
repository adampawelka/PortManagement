using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Resources;

namespace DDDSample1.Infrastructure.Resources
{
    public class ResourceEntityTypeConfiguration : IEntityTypeConfiguration<Resource>
    {
        public void Configure(EntityTypeBuilder<Resource> builder)
        {
            builder.ToTable("Resources", SchemaNames.DDDSample1);
            builder.HasKey(r => r.Id);

            builder.Property(r => r.Id)
                .HasConversion(
                    id => id.AsGuid(),
                    value => new ResourceId(value) 
                )
                .HasColumnType("uuid");

            builder.Property(r => r.Code)
                .HasConversion(
                    code => code.Value,
                    value => new ResourceCode(value)
                )
                .HasColumnType("varchar(200)");

            builder.Property(r => r.Description)
                .HasConversion(
                    desc => desc.Value, 
                    value => new ResourceDescription(value)
                )
                .HasColumnType("text");

            builder.Property(r => r.Type)
                .HasConversion(
                    type => type.Value, 
                    value => new ResourceType(value)
                )
                .HasColumnType("varchar(50)");

            builder.Property(r => r.Capacity)
                .HasConversion(
                    cap => cap.Value, 
                    value => new OperationalCapacity(value)
                )
                .HasColumnType("integer"); 

            builder.Property(r => r.Status)
                .HasConversion(
                    status => status.Value, 
                    value => new AvailabilityStatus(value)
                )
                .HasColumnType("varchar(50)");

            builder.Property(r => r.SetupTime)
                .HasConversion(
                    time => time.Value, 
                    value => new SetupTime(value)
                )
                .HasColumnType("integer");

            builder.OwnsMany(r => r.RequiredQualifications, qb =>
            {
                qb.WithOwner().HasForeignKey("ResourceId");
                qb.Property(q => q.Value) 
                  .HasColumnName("QualificationId")
                  .HasColumnType("text");
            });
        }
    }
}