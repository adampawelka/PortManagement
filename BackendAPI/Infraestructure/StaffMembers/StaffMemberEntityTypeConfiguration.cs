using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.StaffMembers;

namespace DDDSample1.Infrastructure.StaffMembers
{
    public class StaffMemberEntityTypeConfiguration : IEntityTypeConfiguration<StaffMember>
    {
        public void Configure(EntityTypeBuilder<StaffMember> builder)
        {
            builder.ToTable("StaffMembers", SchemaNames.DDDSample1);

            // Klucz główny
            builder.HasKey(s => s.Id);
            builder.Property(s => s.Id)
                   .HasConversion(id => id.Value, value => new StaffMemberId(value))
                   .HasColumnName("Id");

            // MecanographicNumber jako Value Object, unikalny
            builder.Property(s => s.MecanographicNumber)
                   .IsRequired()
                   .HasMaxLength(50)
                   .HasConversion(
                       num => num.Value,            // zapis do DB
                       value => new MecanographicNumber(value) // odczyt z DB
                   )
                   .HasColumnName("MecanographicNumber");

            builder.HasIndex(s => s.MecanographicNumber)
                   .IsUnique();

            // ShortName
            builder.Property(s => s.ShortName)
                   .IsRequired()
                   .HasMaxLength(100);

            // Email
            builder.Property(s => s.Email)
                   .IsRequired()
                   .HasMaxLength(255);

            // Phone (opcjonalne)
            builder.Property(s => s.Phone)
                   .HasMaxLength(50);

            // OperationalWindow jako Value Object
            builder.Property(s => s.OperationalWindow)
                   .IsRequired()
                   .HasMaxLength(500)
                   .HasConversion(
                       ow => ow.Value,                   // zapis do DB
                       value => new OperationalWindow(value) // odczyt z DB
                   );

            // Status
            builder.Property(s => s.Status)
                   .IsRequired()
                   .HasConversion<string>()
                   .HasMaxLength(50);

            builder.HasMany(s => s.Qualifications)
                   .WithMany();
        }
    }
}
