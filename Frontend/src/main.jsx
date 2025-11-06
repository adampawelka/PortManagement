// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react"; // <--- 1. AUTH0
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import "./styles/variables.css"
import './styles/global.css';
import App from "./App.jsx";
import "./i18n/i18n.js";


const AUTH0_DOMAIN = "3dl-e-04.eu.auth0.com"; // <--- Domain
const AUTH0_CLIENT_ID = "2mdcHk7V1KzulJ83QKvrvUToZwvVqjCm";    // <--- User id

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
      <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          // 'audience' is the identifier of the API of C#.
          audience: "http://3dl-e-04api", 
        }}
      >
        <BrowserRouter>
        <App />
        </BrowserRouter>
      </Auth0Provider>
    
  </React.StrictMode>
);


