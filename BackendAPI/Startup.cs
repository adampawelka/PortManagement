using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Backend.Infrastructure;
using Backend.Infrastructure.Shared;
using Backend.Infrastructure.VesselVisitNotifications;
using Backend.Infrastructure.StaffMembers;
using Backend.Domain.Shared;
using Backend.Domain.ShippingAgents;
using Backend.Domain.VesselTypes;
using Backend.Domain.Vessels;
using Backend.Domain.Docks;
using Backend.Domain.VesselVisitNotifications;
using Backend.Domain.StaffMembers;
using Microsoft.OpenApi.Models;
using Backend.Infrastructure.ShippingAgents;
using Backend.Infrastructure.VesselTypes;
using Backend.Infrastructure.Docks;
using Backend.Infrastructure.Vessels;
using Backend.Domain.StorageAreas;
using Backend.Infrastructure.StorageAreas;
using Backend.Domain.Qualifications;
using Backend.Infrastructure.Qualifications;
using Backend.Domain.Resources;
using Backend.Infrastructure.Resources;


namespace Backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DDDSample1DbContext>(options =>options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            ConfigureMyServices(services);

            services.AddControllers().AddNewtonsoftJson();

            // Configure Swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Port Logistics API", Version = "v1" });
                c.EnableAnnotations();
            });
            services.AddRazorPages();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Port Logistics API v1"));
            }
            else
            {
                app.UseHsts();
            }

            //app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints => { endpoints.MapControllers(); endpoints.MapRazorPages(); });
        }
        public void ConfigureMyServices(IServiceCollection services)
        {
            services.AddTransient<IUnitOfWork, UnitOfWork>();

            services.AddTransient<IShippingAgentORepository, ShippingAgentORepository>();
            services.AddTransient<IShippingAgentRRepository, ShippingAgentRRepository>();
            services.AddTransient<ShippingAgentService>();
            services.AddTransient<IVesselTypeRepository, VesselTypeRepository>();
            services.AddTransient<VesselTypeService>();
            services.AddTransient<IDockRepository, DockRepository>();
            services.AddTransient<DockService>();
            services.AddTransient<IVesselRepository, VesselRepository>();
            services.AddTransient<VesselService>();
            services.AddTransient<IVesselVisitNotificationRepository,VesselVisitNotificationRepository>();
            services.AddTransient<VesselVisitNotificationService>();
            services.AddTransient<IStorageAreaRepository,StorageAreaRepository>();
            services.AddTransient<StorageAreaService>();
            services.AddTransient<IQualificationRepository, QualificationRepository>();
            services.AddTransient<QualificationService>();
            services.AddTransient<IResourceRepository, ResourceRepository>();
            services.AddTransient<ResourceService>();
            services.AddTransient<IStaffMemberRepository, StaffMemberRepository>();
            services.AddTransient<StaffMemberService>();

        }
    }
}
