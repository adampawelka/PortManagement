// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react"; // <--- 1. AUTH0
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import "./index.css";


const AUTH0_DOMAIN = "3dl-e-04.eu.auth0.com"; // <--- Domain
const AUTH0_CLIENT_ID = "2mdcHk7V1KzulJ83QKvrvUToZwvVqjCm";    // <--- User id

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          // 'audience' is the identifier of the API of C#.
          audience: "http://3dl-e-04api", 
        }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);


