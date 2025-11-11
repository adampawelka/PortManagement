using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Products;
using DDDSample1.Domain.Families;
using DDDSample1.Domain.ShippingAgents;
using DDDSample1.Domain.Docks;
using DDDSample1.Domain.Vessels;

using DDDSample1.Domain.StorageAreas;
using DDDSample1.Domain.Qualifications;
using DDDSample1.Domain.Resources;
using DDDSample1.Infrastructure.Categories;
using DDDSample1.Infrastructure.Products;
using DDDSample1.Infrastructure.ShippingAgents;
using DDDSample1.Infrastructure.Docks;
using DDDSample1.Infrastructure.Vessels;
using DDDSample1.Infrastructure.VesselTypes;
using DDDSample1.Domain.VesselVisitNotifications;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.VesselVisitNotifications;

using DDDSample1.Infrastructure.StorageAreas;
using DDDSample1.Infrastructure.Qualifications;
using DDDSample1.Infrastructure.Resources;
using DDDSample1.Infrastructure.Users;

using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.VesselTypes;

namespace DDDSample1.Infrastructure
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

        public DbSet<User> Users { get; set; }

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
            modelBuilder.ApplyConfiguration(new UserEntityTypeConfiguration());
        }
    }
}