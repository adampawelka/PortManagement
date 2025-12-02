// ProtectedRouteAndMenu.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProtectedRoute } from "../App";
import PrimaryNavigation from "../components/PrimaryNavigation";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../App.jsx";
import { describe, it, beforeEach, vi } from "vitest";

// ---------------------------
// Mock Auth0
// ---------------------------
let mockIsAuthenticated = false;
let mockUserAuth0 = null;
let mockIsLoading = false;

const mockGetAccessTokenSilently = vi.fn(async () => "fake-token");
const mockLogout = vi.fn();

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isAuthenticated: mockIsAuthenticated,
    user: mockUserAuth0,
    isLoading: mockIsLoading,
    getAccessTokenSilently: mockGetAccessTokenSilently,
    logout: mockLogout,
  }),
}));

// ---------------------------
// Mock useUser
// ---------------------------
vi.mock("../App.jsx", async () => {
  const actual = await vi.importActual("../App.jsx");
  return {
    ...actual,
    useUser: vi.fn(),
  };
});

// ---------------------------
// Mock i18n to return display text
// ---------------------------
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        storage_areas: "Storage Areas",
        vessel_visit_notifications: "Vessel Visit Notifications",
        available_resources: "Available Resources",
        user_management: "User Management",
        pending_notifications: "Pending Notifications",
        approved_notifications: "Approved Notifications",
        rejected_notifications: "Rejected Notifications",
        add_new_notification: "Add New Notification",
        home: "Home",
      };
      return translations[key] || key;
    },
    i18n: { changeLanguage: () => new Promise(() => {}) },
  }),
}));

// ---------------------------
// Helper
// ---------------------------
const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

// ---------------------------
// Tests
// ---------------------------
describe("ProtectedRoute & PrimaryNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Auth0 mock
    mockIsAuthenticated = true;
    mockIsLoading = false;
    mockUserAuth0 = { sub: "auth0|123", name: "Test User", email: "user@test.com" };
  });

  // ---------------------------
  // ProtectedRoute tests
  // ---------------------------
  it("renders children when user has active role", async () => {
    renderWithRouter(
      <ProtectedRoute
        requiredRoles={["Administrator"]}
        testUser={{ role: "Administrator", status: "Active" }}
      >
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });
  });

  it("shows Access Denied for inactive role", async () => {
    renderWithRouter(
      <ProtectedRoute
        requiredRoles={["Administrator"]}
        testUser={{ role: "Administrator", status: "Inactive" }}
      >
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
  });

  it("shows Access Denied for missing role", async () => {
    renderWithRouter(
      <ProtectedRoute
        requiredRoles={["Administrator"]}
        testUser={{ role: null, status: null }}
      >
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    });
  });

  // ---------------------------
  // PrimaryNavigation tests
  // ---------------------------
  it("renders only allowed menu items for LogisticsOperator", async () => {
    useUser.mockReturnValue({ role: "LogisticsOperator", status: "Active" });

    renderWithRouter(<PrimaryNavigation />);

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Storage Areas")).toBeInTheDocument();
      expect(screen.getByText("Available Resources")).toBeInTheDocument();

      expect(screen.queryByText("User Management")).not.toBeInTheDocument();
      expect(screen.queryByText("Vessel Visit Notifications")).not.toBeInTheDocument();
    });
  });

  it("submenus are filtered by role for PortAuthorityOfficer", async () => {
    useUser.mockReturnValue({ role: "PortAuthorityOfficer", status: "Active" });

    renderWithRouter(<PrimaryNavigation />);

    await waitFor(() => {
      expect(screen.getByText("Vessel Visit Notifications")).toBeInTheDocument();
      expect(screen.getByText("Pending Notifications")).toBeInTheDocument();
      expect(screen.getByText("Approved Notifications")).toBeInTheDocument();
      expect(screen.getByText("Rejected Notifications")).toBeInTheDocument();
      expect(screen.getByText("Add New Notification")).toBeInTheDocument();

      expect(screen.queryByText("Storage Areas")).not.toBeInTheDocument();
      expect(screen.queryByText("Available Resources")).not.toBeInTheDocument();
    });
  });
});
