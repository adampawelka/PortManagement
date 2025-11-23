using DDDSample1.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.Users
{
    internal class UserEntityTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users", SchemaNames.DDDSample1);

            builder.HasKey(u => u.Id);
            builder.Property(u => u.Id)
                .HasConversion(
                    id => id.AsGuid(),
                    value => new UserId(value))
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

            builder.OwnsOne(u => u.Role, role =>
            {
                role.Property(r => r.Value)
                    .HasColumnName("Role")
                    .HasMaxLength(50)
                    .IsRequired();
            });

            builder.OwnsOne(u => u.Status, status =>
            {
                status.Property(s => s.Value)
                    .HasColumnName("Status")
                    .HasMaxLength(20)
                    .IsRequired();
            });

            builder.Property(u => u.IamUserId)
                .HasMaxLength(255)
                .IsRequired();

            builder.HasIndex(u => u.IamUserId)
                .IsUnique();

            builder.Property(u => u.ActivationToken)
                .HasMaxLength(100);

            builder.HasIndex(u => u.ActivationToken);

            builder.Property(u => u.ActivationTokenExpiry);

            builder.Property(u => u.CreatedAt)
                .IsRequired();

            builder.Property(u => u.UpdatedAt);

            builder.Property(u => u.ActivatedAt);
        }
    }
}