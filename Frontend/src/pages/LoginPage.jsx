// src/pages/LoginPage.jsx
import React from "react";
import LoginButton from "../components/LoginButton";

const LoginPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1>Login</h1>
      <LoginButton />
    </div>
  );
};

export default LoginPage;
