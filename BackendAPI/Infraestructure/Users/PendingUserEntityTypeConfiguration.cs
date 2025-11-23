using DDDSample1.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.Users
{
    internal class PendingUserEntityTypeConfiguration : IEntityTypeConfiguration<PendingUser>
    {
        public void Configure(EntityTypeBuilder<PendingUser> builder)
        {
            builder.ToTable("PendingUsers", SchemaNames.DDDSample1);

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Id)
                .HasConversion(
                    id => id.AsGuid(),
                    value => new PendingUserId(value))
                .IsRequired();

            builder.OwnsOne(u => u.Email, email =>
            {
                email.Property(e => e.Value)
                    .HasColumnName("Email")
                    .HasMaxLength(255)
                    .IsRequired();
                
                email.HasIndex(e => e.Value)
                    .IsUnique();
            });

            builder.OwnsOne(u => u.Name, name =>
            {
                name.Property(n => n.Value)
                    .HasColumnName("Name")
                    .HasMaxLength(200)
                    .IsRequired();
            });

            builder.Property(u => u.IamUserId)
                .HasMaxLength(255)
                .IsRequired();

            builder.HasIndex(u => u.IamUserId)
                .IsUnique();

            builder.Property(u => u.AttemptedAt)
                .IsRequired();

        }
    }
}