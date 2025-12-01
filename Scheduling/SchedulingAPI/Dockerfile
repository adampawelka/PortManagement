# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY BackendAPI/Backend.csproj BackendAPI/
COPY Scheduling/SchedulingAPI/SchedulingAPI.csproj Scheduling/SchedulingAPI/

# Restore dependencies
RUN dotnet restore Scheduling/SchedulingAPI/SchedulingAPI.csproj

# Copy all source code
COPY BackendAPI/ BackendAPI/
COPY Scheduling/SchedulingAPI/ Scheduling/SchedulingAPI/

RUN rm -f /src/BackendAPI/appsettings.json && \
    rm -f /src/BackendAPI/appsettings.*.json

# Build the Scheduling project only
WORKDIR /src/Scheduling/SchedulingAPI
RUN dotnet build SchedulingAPI.csproj -c Release -o /app/build

# Publish stage
FROM build AS publish
WORKDIR /src/Scheduling/SchedulingAPI

RUN dotnet publish SchedulingAPI.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app


RUN apt-get update && \
    apt-get install -y swi-prolog && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify SWI-Prolog
RUN swipl --version

# Copy published files
COPY --from=publish /app/publish .

# Copy Prolog files
COPY Scheduling/SchedulingAPI/PrologFiles ./PrologFiles

# Create a test to verify everything is in place
RUN echo "=== Checking PrologFiles ===" && \
    ls -la PrologFiles/ && \
    echo "=== Contents of app directory ===" && \
    ls -la

EXPOSE 5001

ENTRYPOINT ["dotnet", "SchedulingAPI.dll"]