using Microsoft.EntityFrameworkCore;
using Backend.Domain.Categories;
using Backend.Domain.Products;
using Backend.Domain.Families;
using Backend.Domain.ShippingAgents;
using Backend.Domain.Docks;
using Backend.Domain.Vessels;
using Backend.Domain.StaffMembers;

using Backend.Domain.StorageAreas;
using Backend.Domain.Qualifications;
using Backend.Domain.Resources;
using Backend.Infrastructure.Categories;
using Backend.Infrastructure.Products;
using Backend.Infrastructure.ShippingAgents;
using Backend.Infrastructure.StaffMembers;
using Backend.Infrastructure.Docks;
using Backend.Infrastructure.Vessels;
using Backend.Infrastructure.VesselTypes;
using Backend.Domain.VesselVisitNotifications;
using Backend.Infrastructure.VesselVisitNotifications;

using Backend.Infrastructure.StorageAreas;
using Backend.Infrastructure.Qualifications;
using Backend.Infrastructure.Resources;

using Backend.Infrastructure.Shared;
using Backend.Domain.VesselTypes;

namespace Backend.Infrastructure
{
    public class DDDSample1DbContext : DbContext
    {
        public DbSet<Category> Categories { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<Family> Families { get; set; }

        public DbSet<ShippingAgentOrganization> ShippingAgentOrganizations { get; set; }

        public DbSet<ShippingAgentRepresentative> ShippingAgentRepresentatives { get; set; }

        public DbSet<VesselType> VesselTypes { get; set; }

        public DbSet<Dock> Docks { get; set; }

        public DbSet<Vessel> Vessels { get; set; }

        public DbSet<VesselVisitNotification> VesselVisitNotifications { get; set; }

        public DbSet<StorageArea> StorageAreas { get; set; }

        public DbSet<Qualification> Qualifications { get; set; }

        public DbSet<Resource> Resources { get; set; }

        public DbSet<StaffMember> StaffMembers { get; set; }

        public DDDSample1DbContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new CategoryEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ProductEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new FamilyEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ShippingAgentOEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ShippingAgentREntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new VesselTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new DockEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new VesselEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new VesselVisitNotificationEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new StorageAreaEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new QualificationEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ResourceEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new StaffMemberEntityTypeConfiguration());

        }
    }
}