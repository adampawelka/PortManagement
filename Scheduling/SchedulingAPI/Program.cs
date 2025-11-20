var builder = WebApplication.CreateBuilder(args);

// ----------------------------------------------------
// 1️⃣ Add services to the container
// ----------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddHttpClient();

// 🟢 Add Swagger services (required for UseSwagger)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🟢 Add CORS policy (to allow React or other clients)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ----------------------------------------------------
// 2️⃣ Build the app
// ----------------------------------------------------
var app = builder.Build();

// ----------------------------------------------------
// 3️⃣ Configure the HTTP request pipeline
// ----------------------------------------------------

// 🟢 Enable Swagger *only* in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 🟢 Enable CORS globally
app.UseCors();

// (Optional) Comment this out if you’re working only with HTTP
// app.UseHttpsRedirection();

app.MapControllers();

app.Run();
