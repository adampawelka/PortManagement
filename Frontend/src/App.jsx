// src/App.jsx
import "./App.css";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import { useAuth0 } from "@auth0/auth0-react"; // <-- Importamos el hook

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // No mostrar nada hasta que Auth0 termine de cargar
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🚢 Sistema de Gestión Portuaria</h1>

        {/* Muestra un botón u otro dependiendo del estado */}
        {!isAuthenticated ? (
          <LoginButton />
        ) : (
          <div>
            <p>
              ¡Hello, <strong>{user.name}</strong>! ({user.email})
            </p>
            <LogoutButton />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;