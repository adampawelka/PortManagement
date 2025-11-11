using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Categories;
using DDDSample1.Infrastructure.Products;
using DDDSample1.Infrastructure.Families;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Infrastructure.VesselVisitNotifications;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Products;
using DDDSample1.Domain.Families;
using DDDSample1.Domain.ShippingAgents;
using DDDSample1.Domain.VesselTypes;
using DDDSample1.Domain.Vessels;
using DDDSample1.Domain.Docks;
using DDDSample1.Domain.VesselVisitNotifications;
using DDDSample1.Domain.Users;
using Microsoft.OpenApi.Models;
using DDDSample1.Infrastructure.ShippingAgents;
using DDDSample1.Infrastructure.VesselTypes;
using DDDSample1.Infrastructure.Docks;
using DDDSample1.Infrastructure.Vessels;
using DDDSample1.Domain.StorageAreas;
using DDDSample1.Infrastructure.StorageAreas;
using DDDSample1.Domain.Qualifications;
using DDDSample1.Infrastructure.Qualifications;
using DDDSample1.Domain.Resources;
using DDDSample1.Infrastructure.Resources;
using DDDSample1.Infrastructure.Users;


namespace DDDSample1
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
            services.AddDbContext<DDDSample1DbContext>(opt =>
                opt.UseInMemoryDatabase("DDDSample1DB")
                   .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());

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

            services.AddTransient<ICategoryRepository, CategoryRepository>();
            services.AddTransient<CategoryService>();

            services.AddTransient<IProductRepository, ProductRepository>();
            services.AddTransient<ProductService>();

            services.AddTransient<IFamilyRepository, FamilyRepository>();
            services.AddTransient<FamilyService>();

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
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<UserService>();

        }
    }
}
