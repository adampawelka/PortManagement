import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from '../App';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Header from '../components/Header'
import Footer from '../components/Footer'
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

jest.mock('react-i18next', () => {
  const React = require('react');
  return {
    useTranslation: () => {
      const [language, setLanguage] = React.useState('en');

      return {
        t: (key) => key, // simple passthrough
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

    // Check the logo
    const logo = screen.getByAltText(/Company Logo/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass('header-logo');

    // Check the title
    const title = screen.getByText(/Port Management Company/i);
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('header-title');
  });

  test('Footer renders correctly', () => {
   render(<Footer />);

    // Check the copyright
    const copyright = screen.getByText(/© 2025 Port Management System/i);
    expect(copyright).toBeInTheDocument();
    expect(copyright).toHaveClass('footer-text');

    // Check the links
    const privacyLink = screen.getByText(/Privacy Policy/i);
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(privacyLink).toHaveClass('footer-link');

    const termsLink = screen.getByText(/Terms of Service/i);
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(termsLink).toHaveClass('footer-link');
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
    // --- Admin scenario ---
    mockIsAuthenticated = true;
    mockUser = { name: 'Admin User', role: 'admin' };
    let { container, unmount } = renderApp('/');
    const primaryNavAdmin = container.querySelector('nav.nav');
    await waitFor(() => {
      expect(primaryNavAdmin).toBeInTheDocument();
      expect(within(primaryNavAdmin).getByText(/Docks/i)).toBeInTheDocument();
    });

    unmount();

    // --- User scenario ---
    mockUser = { name: 'Normal User', role: 'user' };
    ({ container } = renderApp('/'));
    const primaryNavUser = container.querySelector('nav.nav');
    await waitFor(() => {
      expect(primaryNavUser).toBeInTheDocument();
      expect(within(primaryNavUser).queryByText(/Docks/i)).not.toBeInTheDocument();
    });
  });
});
