using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Backend.Domain.Qualifications;

namespace Backend.Infrastructure.Qualifications
{
    public class QualificationEntityTypeConfiguration : IEntityTypeConfiguration<Qualification>
    {
        public void Configure(EntityTypeBuilder<Qualification> builder)
        {
            builder.HasKey(q => q.Id);

            builder.Property(q => q.Id)
                .HasConversion(
                    id => id.AsString(), 
                    value => new QualificationId(value) 
                )
                .HasColumnType("text"); 

            builder.Property(q => q.Code)
                .HasConversion(
                    code => code.Value, 
                    value => new QualificationCode(value)
                );

            builder.Property(q => q.Name)
                .HasConversion(
                    name => name.Value, 
                    value => new QualificationName(value)
                );
        }
    }
}