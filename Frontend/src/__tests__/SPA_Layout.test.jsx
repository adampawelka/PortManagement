import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from '../App';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs'; // ✅ import Breadcrumbs

// ---------------------------
// Mocks
// ---------------------------
let mockIsAuthenticated = false;
let mockUser = null;
let mockIsLoading = false;
let mockLoginWithRedirect = jest.fn();
let mockLogout = jest.fn();
let mockLang = 'en';

// Auth0 mock
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: mockIsAuthenticated,
    isLoading: mockIsLoading,
    user: mockUser,
    loginWithRedirect: mockLoginWithRedirect,
    logout: mockLogout,
  }),
}));

// react-i18next mock
jest.mock('react-i18next', () => {
  const React = require('react');
  return {
    useTranslation: () => {
      const [language, setLanguage] = React.useState('en');

      const translations = {
        privacy_policy: { en: 'Privacy Policy', pt: 'Política de Privacidade' },
        terms_of_service: { en: 'Terms of Service', pt: 'Termos de Serviço' },
        home: { en: 'Home', pt: 'Início' },
        list: { en: 'List', pt: 'Lista' },
        storage_areas: { en: 'Storage Areas', pt: 'Áreas de Armazenamento' },
        visualisation: { en: 'Visualisation', pt: 'Visualização' },
        docks: { en: 'Docks', pt: 'Docas' },
      };

      const t = (key) => translations[key]?.[language] || key;

      // Return an object compatible with your components
      return {
        t,
        i18n: {
          get language() { return language; },
          changeLanguage: (lng) => setLanguage(lng),
        },
      };
    },
  };
});




// ---------------------------
// Helpers
// ---------------------------
const renderApp = (initialRoute = '/') =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );

// ---------------------------
// Unit Tests
// ---------------------------
describe('Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated = false;
    mockUser = null;
    mockIsLoading = false;
    mockLang = 'en';
  });

  test('LoginButton is visible on the login page and calls Auth0', async () => {
    renderApp('/login');
    const loginBtn = screen.getByRole('button', { name: /Log In/i });
    expect(loginBtn).toBeInTheDocument();
    await userEvent.click(loginBtn);
    expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
  });

  test('LanguageSwitcher toggles language when clicked', async () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');

    // Initial button text should match current language
    expect(button).toHaveTextContent('PT'); // 'en' -> button shows 'PT'

    // Toggle to Portuguese
    await userEvent.click(button);
    expect(button).toHaveTextContent('EN'); // now 'pt' -> shows 'EN'

    // Toggle back to English
    await userEvent.click(button);
    expect(button).toHaveTextContent('PT');
  });

  test('Logout button calls logout when authenticated', async () => {
    mockIsAuthenticated = true;
    mockUser = { name: 'Admin User', role: 'admin' };
    renderApp('/');
    const logoutBtn = screen.getByRole('button', { name: /Log Out/i });
    expect(logoutBtn).toBeInTheDocument();
    await userEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('Admin sees Home in PrimaryNavigation and Visualization in Sidebar', async () => {
    mockIsAuthenticated = true;
    mockUser = { name: 'Admin User', role: 'admin' };

    const { container } = renderApp('/');
    const primaryNav = container.querySelector('nav.nav');
    await waitFor(() => {
      expect(primaryNav).toBeInTheDocument();
      expect(within(primaryNav).getByText(/Home/i)).toBeInTheDocument();
    });

    const sidebar = container.querySelector('.sidebar');
    await waitFor(() => {
      expect(sidebar).toBeInTheDocument();
      expect(within(sidebar).getByText(/Visualisation/i)).toBeInTheDocument();
    });
  });

  test('Header component renders logo and navigation links', () => {
    render(<Header />);

    const logo = screen.getByAltText(/Company Logo/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass('header-logo');

    const title = screen.getByText(/Port Management Company/i);
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('header-title');
  });

  test('Footer renders correctly', () => {
    render(<Footer />);

    expect(screen.getByText(/© 2025 Port Management System/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
  });

  describe("Breadcrumbs", () => {
    test("renders breadcrumbs for root path", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Breadcrumbs />
        </MemoryRouter>
      );
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    test("renders breadcrumbs for nested path", () => {
      render(
        <MemoryRouter initialEntries={["/storage-areas/list"]}>
          <Breadcrumbs />
        </MemoryRouter>
      );
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("List")).toBeInTheDocument();
      expect(screen.getByText("Storage Areas")).toBeInTheDocument();
    });

    test("links point to correct paths", () => {
      render(
        <MemoryRouter initialEntries={["/storage-areas/list"]}>
          <Breadcrumbs />
        </MemoryRouter>
      );
      const links = screen.getAllByRole("link");
      expect(links[0]).toHaveAttribute("href", "/");
      expect(links[1]).toHaveAttribute("href", "/storage-areas");
      expect(links[2]).toHaveAttribute("href", "/storage-areas/list");
    });
  });
});

// ---------------------------
// RBAC / Integration Tests
// ---------------------------
describe('RBAC / Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated = false;
    mockUser = null;
    mockIsLoading = false;
    mockLang = 'en';
  });

  test('Admin sees Docks, User does NOT see Docks', async () => {
    // Admin
    mockIsAuthenticated = true;
    mockUser = { name: 'Admin User', role: 'admin' };
    let { container, unmount } = renderApp('/');
    const primaryNavAdmin = container.querySelector('nav.nav');
    await waitFor(() => {
      expect(primaryNavAdmin).toBeInTheDocument();
      expect(within(primaryNavAdmin).getByText(/Docks/i)).toBeInTheDocument();
    });

    unmount();

    // User
    mockUser = { name: 'Normal User', role: 'user' };
    ({ container } = renderApp('/'));
    const primaryNavUser = container.querySelector('nav.nav');
    await waitFor(() => {
      expect(primaryNavUser).toBeInTheDocument();
      expect(within(primaryNavUser).queryByText(/Docks/i)).not.toBeInTheDocument();
    });
  });

  describe("Full navigation flow", () => {

    beforeEach(() => {
      mockIsAuthenticated = true;
      mockUser = { name: 'Admin', role: 'admin' };
    });

    test('Primary navigation link renders correct page content', async () => {
      const { container } = renderApp('/');

      // Query the primary nav by class
      const primaryNav = container.querySelector('nav.nav'); // adjust class if needed
      expect(primaryNav).toBeInTheDocument();

      // Get all matching links and pick the one inside primaryNav
      const vesselsLink = within(primaryNav).getAllByText(/Vessels/i)[0];
      await userEvent.click(vesselsLink);

      // Wait for the page content to render
      await waitFor(() => {
        // Pick the element outside nav to avoid the link itself
        const pageContent = screen.getAllByText(/Vessels/i).find(el => !primaryNav.contains(el));
        expect(pageContent).toBeInTheDocument();
      });
    });

    test('Sidebar link renders Visualisation page content', async () => {
      const { container } = renderApp('/');

      // Query the sidebar
      const sidebar = container.querySelector('.sidebar');
      expect(sidebar).toBeInTheDocument();

      const visualisationLink = within(sidebar).getAllByText(/Visualisation/i)[0];
      await userEvent.click(visualisationLink);

      // Wait for the Visualisation page content
      await waitFor(() => {
        const pageContent = screen.getAllByText(/Visualisation/i).find(el => !sidebar.contains(el));
        expect(pageContent).toBeInTheDocument();
      });
    });

    });
   
test('Language switch updates texts throughout the layout', async () => {
  // Mock user authentication (assuming you have a mock authentication function)
  mockIsAuthenticated = true;

  // Render the app and ensure it's in the logged-in state
  const { container } = renderApp('/');

  // Wait for the language switcher to appear (i.e., only visible after login)
  const langButton = await screen.findByRole('button', { name: /en|pt/i });

  // Ensure the button initially shows 'PT' when the language is 'en'
  expect(langButton).toHaveTextContent('PT');

  // Check for 'Home' text initially
  const homeElements = screen.getAllByText('Home');
  expect(homeElements).toHaveLength(3); // Expect 'Home' to appear in multiple places (e.g., nav, header, etc.)

  // Switch to Portuguese (click the button)
  await userEvent.click(langButton);

  // Wait for the language change to propagate
  await waitFor(() => {
    // After switching, the button should show 'EN'
    expect(langButton).toHaveTextContent('EN');
  });

  // Wait for the 'Início' text to appear and 'Home' to disappear
  await waitFor(() => {
    expect(screen.getByText(/Início/i)).toBeInTheDocument(); // 'Início' should be visible after switching
    expect(screen.queryByText('Home')).not.toBeInTheDocument(); // 'Home' should no longer be visible
  });

  // Switch back to English
  await userEvent.click(langButton);

  // Wait for the language change to propagate again
  await waitFor(() => {
    // After switching back, the button should show 'PT'
    expect(langButton).toHaveTextContent('PT');
  });

  // Wait for the 'Home' text to appear again and 'Início' to disappear
  await waitFor(() => {
    expect(screen.getByText('Home')).toBeInTheDocument(); // 'Home' should be visible again after switching back
    expect(screen.queryByText('Início')).not.toBeInTheDocument(); // 'Início' should no longer be visible
  });
});


  test('Redirects unauthenticated users from internal pages', async () => {
    mockIsAuthenticated = false; // user is not logged in

    // Try to access a protected page, e.g., Visualisation
    renderApp('/visualisation');

    // Wait for redirection to /login
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
    });

    // Optionally, check that protected content is NOT rendered
    expect(screen.queryByText(/Visualisation/i)).not.toBeInTheDocument();
  });
});

