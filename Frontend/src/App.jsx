import React from "react";
import GlobalLayout from "./components/GlobalLayout.jsx";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import PortVisualisation from "./components/PortVisualisation.jsx";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <GlobalLayout>
      <div className="container">
        <header>
          {/* Conditional render based on authentication */}
          {!isAuthenticated ? (
            <LoginButton />
          ) : (
            <div>
              <p>
                Hello, <strong>{user.name}</strong> ({user.email})
              </p>
              <LogoutButton />
            </div>
          )}
        </header>
        {/* Show the port visualisation under the welcome message when authenticated */}
        {isAuthenticated ? (
          <main>
            <h2>Welcome to Dock Manage System</h2>
            <PortVisualisation />
          </main>
        ) : (
          <div>
            <p>Please log in to access the port visualisation.</p>
          </div>
        )}
      </div>
    </GlobalLayout>
  );
}

export default App;
