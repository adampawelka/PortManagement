import React from "react";
import GlobalLayout from "./components/GlobalLayout.jsx";
import "./App.css";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Show loading indicator while Auth0 is initializing
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <GlobalLayout>
      <div className="app-container">
        <header className="app-header">
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
      </div>
    </GlobalLayout>
  );
}

export default App;
