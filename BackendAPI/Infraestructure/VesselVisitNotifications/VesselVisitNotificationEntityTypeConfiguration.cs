using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Backend.Domain.VesselVisitNotifications;
using Backend.Domain.Docks; // <--- AÑADIDO

// NAMESPACE ESTANDARIZADO A DDDSample1
namespace Backend.Infrastructure.VesselVisitNotifications
{
    internal class VesselVisitNotificationEntityTypeConfiguration : IEntityTypeConfiguration<VesselVisitNotification>
    {
        public void Configure(EntityTypeBuilder<VesselVisitNotification> builder)
        {
            builder.ToTable("VesselVisitNotifications"); //, SchemaNames.Port);
            
            builder.HasKey(vvn => vvn.Id);

            // --- Configuración de 2.2.9 ---
            builder.HasOne(vvn => vvn.Vessel)
                     .WithMany()
                     .HasForeignKey("VesselId");
                     
            builder.HasOne(vvn => vvn.SubmittedBy)
                     .WithMany()
                     .HasForeignKey("SubmittedById");
                     
            builder.OwnsOne(vvn => vvn.Status);
            
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
                .HasConversion(id => id.AsGuid(), value => new DockId(value)) // Adaptado a AsGuid()
                .HasColumnName("AssignedDockId")
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
                   .IsRequired(false);

            builder.Property(n => n.DecisionTimestamp)
                   .IsRequired(false);
        }
    }
}