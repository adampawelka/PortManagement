using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection; 
using Microsoft.EntityFrameworkCore;           
using System;

namespace DDDSample1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateWebHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<DDDSample1.Infrastructure.DDDSample1DbContext>();

                    context.Database.Migrate();
                    Console.WriteLine("Database Migrated Successfully.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Database Migration Failed: {ex.Message}");
                }
            }
            host.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}