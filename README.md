# Port Management System

A full-stack port authority management system built with Clean Architecture and Domain-Driven Design principles. The system handles vessel visit lifecycles, dock scheduling, cargo manifests, crew management, staff allocation, and AI-driven berth scheduling — all served through a multi-service Docker deployment.

> Originally developed as part of the ISEP LEI-SEM5 Integrative Project (2025–26, team 3DL-E-04), now continued independently as a personal portfolio project.

---

## Architecture Overview

The system is composed of four independently deployable services:

```
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│  React Frontend │───▶│  ASP.NET Core 8 API   │───▶│    PostgreSQL    │
└─────────────────┘     │  (Clean Architecture)│     └──────────────────┘
                        └──────────────────────┘
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
           ┌──────────────────┐       ┌──────────────────────┐
           │  Scheduling API  │       │      OEM Module      │
           │ (Prolog + .NET 8)│       │  (Node.js, MongoDB)  │
           └──────────────────┘       └──────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | ASP.NET Core 8, EF Core 8, PostgreSQL |
| Authentication | Auth0 JWT Bearer |
| AI Scheduling | Prolog (SWI-Prolog) + Genetic Algorithm, exposed via .NET 8 API |
| OEM Module | Node.js, TypeScript, MongoDB |
| Frontend | React, Vite |
| Testing | xUnit, Moq |
| API Docs | Swagger / OpenAPI |
| Infrastructure | Docker, Docker Compose |

---

## Backend API — Domain Model

The API is structured around these bounded contexts:

| Aggregate | Responsibility |
|---|---|
| **Vessels** | Vessel registry with IMO validation and type classification |
| **VesselVisitNotifications** | Full visit lifecycle: submission → approval/rejection, cargo manifests, crew members |
| **Docks** | Dock registry and availability management |
| **StorageAreas** | Storage zone definitions and operational constraints |
| **ShippingAgents** | Agent organisations and their representatives |
| **StaffMembers** | Port staff with qualification tracking |
| **Qualifications** | Skill definitions assignable to staff |
| **Resources** | Equipment and resource inventory |
| **VesselTypes** | Type catalogue with operational constraints (rows, bays, tiers) |

---



## Scheduling Module

The scheduling engine uses a **Genetic Algorithm implemented in Prolog** to assign vessels to docks across time slots, optimising for constraints such as dock capacity, vessel type compatibility, and visit duration. The Prolog engine is invoked from a .NET 8 API that fetches live vessel and dock data from the main backend.

---

## Running with Docker

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API + Swagger | http://localhost:5000/swagger |
| Scheduling API | http://localhost:5107 |
| OEM Module | http://localhost:5161 |

---

## Running Locally

**Prerequisites:** .NET 8 SDK, Node.js 20+, PostgreSQL

```bash
# 1. Restore and build
dotnet build master.sln

# 2. Apply database migrations
cd BackendAPI && dotnet ef database update

# 3. Run the API
dotnet run --project BackendAPI/Backend.csproj

# 4. Run tests
dotnet test BackendAPI.Tests/BackendAPI.Tests.csproj

# 5. Run the frontend
cd Frontend && npm install && npm run dev
```

---


## Docs

Architecture diagrams (domain model, logical, physical, sequence) are in `/docs` as PlantUML sources and rendered SVGs.
