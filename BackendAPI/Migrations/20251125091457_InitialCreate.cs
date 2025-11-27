using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "ddd");

            migrationBuilder.CreateTable(
                name: "Docks",
                schema: "ddd",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    DockName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    DockLocation = table.Column<string>(type: "text", nullable: true),
                    Depth = table.Column<double>(type: "float", nullable: true),
                    Length = table.Column<double>(type: "float", nullable: true),
                    MaxDraft = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Docks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PendingUsers",
                schema: "ddd",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    IamUserId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    AttemptedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PendingUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Qualifications",
                schema: "ddd",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Qualifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Resources",
                schema: "ddd",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "varchar(200)", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<string>(type: "varchar(50)", nullable: true),
                    Capacity = table.Column<int>(type: "integer", nullable: true),
                    Status = table.Column<string>(type: "varchar(50)", nullable: true),
                    SetupTime = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resources", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShippingAgentOrganizations",
                schema: "ddd",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    LegalName = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    TaxNumber = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingAgentOrganizations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StaffMembers",
                schema: "ddd",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    MecanographicNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ShortName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    OperationalWindow = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffMembers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StorageAreas",
                schema: "ddd",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "varchar(200)", nullable: true),
                    Location = table.Column<string>(type: "text", nullable: true),
                    MaxCapacity = table.Column<decimal>(type: "numeric", nullable: true),
                    CurrentOccupancy = table.Column<decimal>(type: "numeric", nullable: true),
                    DockDistances = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorageAreas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "ddd",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    ActivationToken = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ActivationTokenExpiry = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ActivatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IamUserId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VesselTypes",
                schema: "ddd",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Capacity = table.Column<int>(type: "integer", nullable: false),
                    MaxRows = table.Column<int>(type: "integer", nullable: true),
                    MaxBays = table.Column<int>(type: "integer", nullable: true),
                    MaxTiers = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VesselTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "QualificationId",
                schema: "ddd",
                columns: table => new
                {
                    ResourceId = table.Column<Guid>(type: "uuid", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    QualificationId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QualificationId", x => new { x.ResourceId, x.Id });
                    table.ForeignKey(
                        name: "FK_QualificationId_Resources_ResourceId",
                        column: x => x.ResourceId,
                        principalSchema: "ddd",
                        principalTable: "Resources",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ShippingAgentRepresentatives",
                schema: "ddd",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    CitizenId = table.Column<string>(type: "text", nullable: true),
                    Nationality = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    ShippingAgentOrganizationId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingAgentRepresentatives", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShippingAgentRepresentatives_ShippingAgentOrganizations_Shi~",
                        column: x => x.ShippingAgentOrganizationId,
                        principalSchema: "ddd",
                        principalTable: "ShippingAgentOrganizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QualificationStaffMember",
                schema: "ddd",
                columns: table => new
                {
                    QualificationsId = table.Column<string>(type: "text", nullable: false),
                    StaffMemberId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QualificationStaffMember", x => new { x.QualificationsId, x.StaffMemberId });
                    table.ForeignKey(
                        name: "FK_QualificationStaffMember_Qualifications_QualificationsId",
                        column: x => x.QualificationsId,
                        principalSchema: "ddd",
                        principalTable: "Qualifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QualificationStaffMember_StaffMembers_StaffMemberId",
                        column: x => x.StaffMemberId,
                        principalSchema: "ddd",
                        principalTable: "StaffMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DockAllowedVesselTypes",
                schema: "ddd",
                columns: table => new
                {
                    DockId = table.Column<string>(type: "text", nullable: false),
                    VesselTypeId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DockAllowedVesselTypes", x => new { x.DockId, x.VesselTypeId });
                    table.ForeignKey(
                        name: "FK_DockAllowedVesselTypes_Docks_DockId",
                        column: x => x.DockId,
                        principalSchema: "ddd",
                        principalTable: "Docks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DockAllowedVesselTypes_VesselTypes_VesselTypeId",
                        column: x => x.VesselTypeId,
                        principalSchema: "ddd",
                        principalTable: "VesselTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vessels",
                schema: "ddd",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IMO = table.Column<string>(type: "text", nullable: true),
                    VesselName = table.Column<string>(type: "text", nullable: true),
                    VesselTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vessels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vessels_ShippingAgentOrganizations_OwnerId",
                        column: x => x.OwnerId,
                        principalSchema: "ddd",
                        principalTable: "ShippingAgentOrganizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Vessels_VesselTypes_VesselTypeId",
                        column: x => x.VesselTypeId,
                        principalSchema: "ddd",
                        principalTable: "VesselTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VesselVisitNotifications",
                schema: "ddd",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    VesselId = table.Column<Guid>(type: "uuid", nullable: true),
                    SubmittedById = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: true),
                    ETA = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ETD = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AssignedDockId = table.Column<Guid>(type: "uuid", nullable: true),
                    RejectionReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    DecidingOfficerId = table.Column<Guid>(type: "uuid", nullable: true),
                    DecisionTimestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VesselVisitNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VesselVisitNotifications_Docks_AssignedDockId",
                        column: x => x.AssignedDockId,
                        principalSchema: "ddd",
                        principalTable: "Docks",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_VesselVisitNotifications_ShippingAgentRepresentatives_Submi~",
                        column: x => x.SubmittedById,
                        principalSchema: "ddd",
                        principalTable: "ShippingAgentRepresentatives",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_VesselVisitNotifications_Vessels_VesselId",
                        column: x => x.VesselId,
                        principalSchema: "ddd",
                        principalTable: "Vessels",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CargoManifest",
                schema: "ddd",
                columns: table => new
                {
                    VesselVisitNotificationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ManifestType = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CargoManifest", x => new { x.VesselVisitNotificationId, x.Id });
                    table.ForeignKey(
                        name: "FK_CargoManifest_VesselVisitNotifications_VesselVisitNotificat~",
                        column: x => x.VesselVisitNotificationId,
                        principalSchema: "ddd",
                        principalTable: "VesselVisitNotifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CrewMember",
                schema: "ddd",
                columns: table => new
                {
                    VesselVisitNotificationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    CitizenId = table.Column<string>(type: "text", nullable: true),
                    Nationality = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CrewMember", x => new { x.VesselVisitNotificationId, x.Id });
                    table.ForeignKey(
                        name: "FK_CrewMember_VesselVisitNotifications_VesselVisitNotification~",
                        column: x => x.VesselVisitNotificationId,
                        principalSchema: "ddd",
                        principalTable: "VesselVisitNotifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContainerIdentifier",
                schema: "ddd",
                columns: table => new
                {
                    CargoManifestVesselVisitNotificationId = table.Column<Guid>(type: "uuid", nullable: false),
                    CargoManifestId = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ContainerIdentifier = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContainerIdentifier", x => new { x.CargoManifestVesselVisitNotificationId, x.CargoManifestId, x.Id });
                    table.ForeignKey(
                        name: "FK_ContainerIdentifier_CargoManifest_CargoManifestVesselVisitN~",
                        columns: x => new { x.CargoManifestVesselVisitNotificationId, x.CargoManifestId },
                        principalSchema: "ddd",
                        principalTable: "CargoManifest",
                        principalColumns: new[] { "VesselVisitNotificationId", "Id" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DockAllowedVesselTypes_VesselTypeId",
                schema: "ddd",
                table: "DockAllowedVesselTypes",
                column: "VesselTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PendingUsers_Email",
                schema: "ddd",
                table: "PendingUsers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PendingUsers_IamUserId",
                schema: "ddd",
                table: "PendingUsers",
                column: "IamUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QualificationStaffMember_StaffMemberId",
                schema: "ddd",
                table: "QualificationStaffMember",
                column: "StaffMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_ShippingAgentRepresentatives_ShippingAgentOrganizationId",
                schema: "ddd",
                table: "ShippingAgentRepresentatives",
                column: "ShippingAgentOrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_StaffMembers_MecanographicNumber",
                schema: "ddd",
                table: "StaffMembers",
                column: "MecanographicNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_ActivationToken",
                schema: "ddd",
                table: "Users",
                column: "ActivationToken");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                schema: "ddd",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_IamUserId",
                schema: "ddd",
                table: "Users",
                column: "IamUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vessels_OwnerId",
                schema: "ddd",
                table: "Vessels",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Vessels_VesselTypeId",
                schema: "ddd",
                table: "Vessels",
                column: "VesselTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisitNotifications_AssignedDockId",
                schema: "ddd",
                table: "VesselVisitNotifications",
                column: "AssignedDockId");

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisitNotifications_SubmittedById",
                schema: "ddd",
                table: "VesselVisitNotifications",
                column: "SubmittedById");

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisitNotifications_VesselId",
                schema: "ddd",
                table: "VesselVisitNotifications",
                column: "VesselId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContainerIdentifier",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "CrewMember",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "DockAllowedVesselTypes",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "PendingUsers",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "QualificationId",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "QualificationStaffMember",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "StorageAreas",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "CargoManifest",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "Resources",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "Qualifications",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "StaffMembers",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "VesselVisitNotifications",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "Docks",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "ShippingAgentRepresentatives",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "Vessels",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "ShippingAgentOrganizations",
                schema: "ddd");

            migrationBuilder.DropTable(
                name: "VesselTypes",
                schema: "ddd");
        }
    }
}
