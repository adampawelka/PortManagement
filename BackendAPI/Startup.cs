using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Infrastructure.VesselVisitNotifications;
using DDDSample1.Domain.Shared;
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

// JWT
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;

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
            services.AddDbContext<DDDSample1DbContext>(options =>options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            ConfigureMyServices(services);

            services.AddControllers().AddNewtonsoftJson();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Port Logistics API", Version = "v1" });
                c.EnableAnnotations();
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                builder => builder
                .WithOrigins(
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "https://localhost:5173"
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());
            });

            // --- JWT Authentication ---
            var jwtKey = Configuration["Jwt:Key"];
            var jwtIssuer = Configuration["Jwt:Issuer"];
            var jwtAudience = Configuration["Jwt:Audience"];

            if (string.IsNullOrWhiteSpace(jwtKey) ||
                string.IsNullOrWhiteSpace(jwtIssuer) ||
                string.IsNullOrWhiteSpace(jwtAudience))
            {
                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
                {
                    // Generate a temporary key for development
                    jwtKey = "DevSecretKey123456"; // Must be at least 16 chars
                    jwtIssuer = "https://localhost:5000";
                    jwtAudience = "api://default";
                    Console.WriteLine("⚠️  JWT config missing. Using temporary development key.");
                }
                else
                {
                    throw new InvalidOperationException("JWT configuration is missing in appsettings.json or environment variables.");
                }
            }

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        ValidIssuer = jwtIssuer,
                        ValidAudience = jwtAudience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                    };
                });

            services.AddAuthorization();
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

            // app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("AllowFrontend");

            app.UseAuthentication(); // <-- required for JWT
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
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<UserService>();
            services.AddTransient<IPendingUserRepository, PendingUserRepository>();
            services.AddTransient<PendingUserService>();
        }
    }
}
