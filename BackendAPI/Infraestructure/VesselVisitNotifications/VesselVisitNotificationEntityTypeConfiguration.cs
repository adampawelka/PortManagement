using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.VesselVisitNotifications;
using DDDSample1.Domain.Docks;
using DDDSample1.Domain.Vessels;
using DDDSample1.Domain.ShippingAgents;

namespace DDDSample1.Infrastructure.VesselVisitNotifications
{
    internal class VesselVisitNotificationEntityTypeConfiguration : IEntityTypeConfiguration<VesselVisitNotification>
    {
        public void Configure(EntityTypeBuilder<VesselVisitNotification> builder)
        {
            builder.ToTable("VesselVisitNotifications", SchemaNames.DDDSample1); //, SchemaNames.Port);
           
            builder.HasKey(vvn => vvn.Id);

            builder.Property(vvn => vvn.Id)
                .HasConversion(
                    id => id.AsGuid(),  // To DB: convert to Guid
                    value => new VesselVisitNotificationId(value)  // From DB: create from Guid
                )
                .HasColumnType("uuid")
                .IsRequired();

            // --- Configuración de 2.2.9 ---
            builder.HasOne(vvn => vvn.Vessel)
                     .WithMany()
                     .HasForeignKey("VesselId");
                     
            builder.HasOne(vvn => vvn.SubmittedBy)
                     .WithMany()
                     .HasForeignKey("SubmittedById");

            builder.Property(vvn => vvn.VesselId)
                .HasConversion(
                    id => id.AsGuid(),
                    value => new VesselId(value)
                )
                .HasColumnType("uuid");

            builder.Property(vvn => vvn.SubmittedById)
                .HasConversion(
                    id => id.AsGuid(),
                    value => new ShippingAgentRepresentativeId(value.ToString())
                )
                .HasColumnType("uuid");

            builder.Property(vvn => vvn.ETA)
                .IsRequired();

            builder.Property(vvn => vvn.ETD)
                .IsRequired();
                     
            builder.OwnsOne(vvn => vvn.Status, sBuilder =>
            {
                sBuilder.Property(s => s.Value)
                    .HasColumnName("Status")
                    .IsRequired();
            });
           
            builder.OwnsMany(vvn => vvn.CargoManifests, cmBuilder =>
            {
                cmBuilder.Property(cm => cm.ManifestType);
                cmBuilder.OwnsMany(cm => cm.Containers, cBuilder =>
                {
                    cBuilder.Property(c => c.Value).HasColumnName("ContainerIdentifier");
                });
            });
            builder.OwnsMany(vvn => vvn.CrewMembers, cmBuilder =>
            {
                cmBuilder.Property(cm => cm.Name);
                cmBuilder.Property(cm => cm.CitizenId);
                cmBuilder.Property(cm => cm.Nationality);
            });
            // --- CONFIGURACIÓN AÑADIDA DE 2.2.8 / 2.2.7 ---
            builder.Property(n => n.AssignedDockId)
                .HasConversion(id => id.AsGuid(), value => true ? new DockId(value) : null) // Handle nullable
                .HasColumnName("AssignedDockId")
                .HasColumnType("uuid")
                .IsRequired(false); // Es NULABLE
            // Relación con Dock (opcional pero recomendado)
            builder.HasOne(typeof(Dock))
                   .WithMany()
                   .HasForeignKey("AssignedDockId")
                   .IsRequired(false);
            builder.Property(n => n.RejectionReason)
                   .HasMaxLength(500)
                   .IsRequired(false);
            builder.Property(n => n.DecidingOfficerId)
                   .HasColumnType("uuid")
                   .IsRequired(false);
            builder.Property(n => n.DecisionTimestamp)
                   .IsRequired(false);
        }
    }
}