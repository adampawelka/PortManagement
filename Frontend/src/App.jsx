// --- App.jsx ---
// Componente principal de la aplicación

// Importamos los estilos CSS para este componente
import "./App.css";

function App() {
  // El "return" define lo que se va a pintar en la pantalla
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🚢 Dock Manage System</h1>
        <p>
          Welcome to the project. This is main page (`App.jsx`).
        </p>
        <p className="hint">
          ( US 3.1.1 Test completed sucessfully )
        </p>
      </header>
    </div>
  );
}

// Exportamos el componente para que 'main.jsx' pueda importarlo
export default App;