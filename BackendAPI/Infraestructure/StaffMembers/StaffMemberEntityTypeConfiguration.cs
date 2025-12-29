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

            builder.HasKey(s => s.Id);
            builder.Property(s => s.Id)
                .HasConversion(id => id.Value, value => new StaffMemberId(value))
                .HasColumnName("Id");

            builder.Property(s => s.MecanographicNumber)
                .IsRequired()
                .HasMaxLength(50)
                .HasConversion(
                    num => num.Value,
                    value => new MecanographicNumber(value)
                )
                .HasColumnName("MecanographicNumber");

            builder.HasIndex(s => s.MecanographicNumber)
                   .IsUnique(); 

            builder.Property(s => s.ShortName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(s => s.Email)
                   .IsRequired()
                   .HasMaxLength(255);

            builder.Property(s => s.Phone)
                   .HasMaxLength(50);

            builder.Property(s => s.OperationalWindow)
                   .IsRequired()
                   .HasMaxLength(500)
                   .HasConversion(
                       ow => ow.Value,                   
                       value => new OperationalWindow(value) 
                   );

            builder.Property(s => s.Status)
                   .IsRequired()
                   .HasConversion<string>()
                   .HasMaxLength(50);

            builder.HasMany(s => s.Qualifications)
                   .WithMany();
        }
    }
}
