using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Backend.Domain.StaffMembers;

namespace Backend.Infrastructure.StaffMembers
{
    public class StaffMemberEntityTypeConfiguration : IEntityTypeConfiguration<StaffMember>
    {
        public void Configure(EntityTypeBuilder<StaffMember> builder)
        {

            builder.HasKey(s => s.Id);
            builder.Property(s => s.Id)
                .HasConversion(id => id.Value, value => new StaffMemberId(value))
                .HasColumnName("Id");

            // Mapeo del Value Object MecanographicNumber
            builder.Property(s => s.MecanographicNumber)
                .IsRequired()
                .HasMaxLength(50)
                .HasConversion(num => num.Value, value => new MecanographicNumber(value))
                .HasColumnName("MecanographicNumber");
            
            builder.HasIndex(s => s.MecanographicNumber).IsUnique(); // Asegurar unicidad en BD

            builder.Property(s => s.ShortName).IsRequired().HasMaxLength(100);
            builder.Property(s => s.Email).IsRequired().HasMaxLength(255);
            builder.Property(s => s.Phone).HasMaxLength(50);
            builder.Property(s => s.OperationalWindow).HasMaxLength(500);

            builder.Property(s => s.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50);

            // Relación Muchos-a-Muchos
            builder.HasMany(s => s.Qualifications)
                .WithMany();
                // EF Core creará la tabla de unión automáticamente
        }
    }
}