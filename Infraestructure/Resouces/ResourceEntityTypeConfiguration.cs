using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Resources;

namespace DDDSample1.Infrastructure.Resources
{
    internal class ResourceEntityTypeConfiguration : IEntityTypeConfiguration<Resource>
    {
        public void Configure(EntityTypeBuilder<Resource> builder)
        {
            builder.HasKey(x => x.Id);

            builder.OwnsOne(x => x.Code);
            builder.OwnsOne(x => x.Description);
            builder.OwnsOne(x => x.Type);
            builder.OwnsOne(x => x.Capacity);
            builder.OwnsOne(x => x.Status);
            builder.OwnsOne(x => x.SetupTime);

            
            builder
                .Property<string>("RequiredQualificationsSerialized")
                .HasColumnName("RequiredQualifications");
        }
    }
}
