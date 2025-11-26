using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
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
using DDDSample1.Domain.StaffMembers;
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
using DDDSample1.Infrastructure.StaffMembers;

// JWT
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
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
            // Database
            services.AddDbContext<DDDSample1DbContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            ConfigureMyServices(services);

            services.AddControllers().AddNewtonsoftJson();

            // Swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Port Logistics API", Version = "v1" });
                c.EnableAnnotations();
            });

            // CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    builder => builder
                        .WithOrigins(
                            "http://localhost:5173",
                            "http://localhost:3000",
                            "https://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            // --- JWT Authentication with Auth0 ---
            var auth0Domain = Configuration["Auth0:Domain"];
            var auth0Audience = Configuration["Auth0:Audience"];

            if (string.IsNullOrWhiteSpace(auth0Domain) || string.IsNullOrWhiteSpace(auth0Audience))
            {
                throw new InvalidOperationException("Auth0 configuration missing in appsettings.json.");
            }

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = $"https://{auth0Domain}/";
                    options.Audience = auth0Audience;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true
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
                app.UseSwaggerUI(c =>
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Port Logistics API v1"));
            }
            else
            {
                app.UseHsts();
            }

            // app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors("AllowFrontend");

            app.UseAuthentication(); // JWT
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapRazorPages();
            });
        }

        private void ConfigureMyServices(IServiceCollection services)
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
            services.AddTransient<IVesselVisitNotificationRepository, VesselVisitNotificationRepository>();
            services.AddTransient<VesselVisitNotificationService>();
            services.AddTransient<IStorageAreaRepository, StorageAreaRepository>();
            services.AddTransient<StorageAreaService>();
            services.AddTransient<IQualificationRepository, QualificationRepository>();
            services.AddTransient<QualificationService>();
            services.AddTransient<IResourceRepository, ResourceRepository>();
            services.AddTransient<ResourceService>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<UserService>();
            services.AddTransient<IPendingUserRepository, PendingUserRepository>();
            services.AddTransient<PendingUserService>();
            services.AddTransient<IStaffMemberRepository, StaffMemberRepository>();
            services.AddTransient<StaffMemberService>();
        }
    }
}
