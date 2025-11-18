import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import userEvent from '@testing-library/user-event';

/**
 * Mocki Auth0 i i18n
 */
let mockIsAuthenticated = false;
let mockUser = null;
let mockIsLoading = false;
let mockLoginWithRedirect = jest.fn();
let mockLogout = jest.fn();
let mockLang = 'en';

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: mockIsAuthenticated,
    isLoading: mockIsLoading,
    user: mockUser,
    loginWithRedirect: mockLoginWithRedirect,
    logout: mockLogout,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    const t = (key, params = {}) => {
      const translations = {
        'system.name': { en: 'Port Management SPA', pt: 'SPA de Gestão Portuária' },
        'nav.home': { en: 'Home', pt: 'Início' },
        'nav.visualization': { en: 'Visualization', pt: 'Visualização' },
        'nav.dock': { en: 'Docks', pt: 'Docas' },
        'welcome.message': { en: 'Welcome to the Port Management Dashboard!', pt: 'Bem-vindo ao Painel de Gestão Portuária!' },
        'page.visualization': { en: 'Interactive charts and maps', pt: 'Interaktywne wykresy i mapy' },
        'language': { en: 'Language', pt: 'Idioma' },
        'login.title': { en: 'Please Log In to continue', pt: 'Por favor, inicie sessão para continuar' },
      };
      let text = translations[key]?.[mockLang] || key;
      if (params.role) text = text.replace('{role}', params.role);
      return text;
    };
    return {
      t,
      i18n: {
        language: mockLang,
        changeLanguage: (lng) => { mockLang = lng; },
      },
    };
  },
}));

// Helper do renderowania aplikacji
const renderApp = (initialRoute = '/') => render(
  <MemoryRouter initialEntries={[initialRoute]}>
    <App />
  </MemoryRouter>
);

describe('App Integration Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated = false;
    mockUser = null;
    mockIsLoading = false;
    mockLang = 'en';
  });

  describe('Unit Tests', () => {

    test('LoginButton jest widoczny na stronie logowania i wywołuje Auth0', async () => {
      renderApp('/login');
      const loginBtn = screen.getByRole('button', { name: /Log In/i });
      expect(loginBtn).toBeInTheDocument();
      await userEvent.click(loginBtn);
      expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
    });

    test('Admin widzi Home w PrimaryNavigation i Visualization w Sidebar', async () => {
      mockIsAuthenticated = true;
      mockUser = { name: 'Admin User', role: 'admin' };

      const { container } = renderApp('/');

      // PrimaryNavigation
      const primaryNav = container.querySelector('nav.nav');
      await waitFor(() => {
        expect(primaryNav).toBeInTheDocument();
        expect(within(primaryNav).getByText(/Home/i)).toBeInTheDocument();
      });

      // Sidebar
      const sidebar = container.querySelector('.sidebar');
      await waitFor(() => {
        expect(sidebar).toBeInTheDocument();
        expect(within(sidebar).getByText(/Visualisation/i)).toBeInTheDocument();
      });
    });

  });

});
