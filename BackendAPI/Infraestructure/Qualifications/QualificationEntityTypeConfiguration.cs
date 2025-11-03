using DDDSample1.Domain.Qualifications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.Qualifications
{
    internal class QualificationEntityTypeConfiguration : IEntityTypeConfiguration<Qualification>
    {
        public void Configure(EntityTypeBuilder<Qualification> builder)
        {
            builder.HasKey(x => x.Id);

            builder.OwnsOne(x => x.Code, code =>
             {
                 code.Property(p => p.Value)
                     .IsRequired()
                     .HasMaxLength(50)
                     .HasColumnName("Code");


                 code.HasIndex(p => p.Value)
                     .IsUnique();
             });

            builder.OwnsOne(x => x.Name, name =>
            {
                name.Property(p => p.Value)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnName("Name");
            });
        }
    }
}