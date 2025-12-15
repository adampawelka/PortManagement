using Microsoft.EntityFrameworkCore;
// Make sure this namespace matches what your friend used in her Domain folder
using OEMAPI.Domain.Incidents; 

namespace OEMAPI.Infrastructure.Database
{
    public class OEMDbContext : DbContext
    {
        public OEMDbContext(DbContextOptions<OEMDbContext> options) : base(options)
        {
        }

        // Add this line so EF knows to create the 'Incidents' table
        public DbSet<Incident> Incidents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Maps the "Id" property to the Primary Key
            modelBuilder.Entity<Incident>().HasKey(i => i.Id);
        }
    }
}