// src/pages/LoginPage.jsx
import React from "react";
import LoginButton from "../components/LoginButton";

const LoginPage = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
      textAlign: "center"
    }}>
      <h1>Welcome to the App</h1>
      <LoginButton />
    </div>
  );
};

export default LoginPage;
