import React from "react";
import Header from "./Header";

const GlobalLayout = ({ children }) => {
  return (
    <div style={{ width: "100%", minHeight: "100vh", boxSizing: "border-box" }}>
      {/* Header stays at the top */}
      <Header />

      {/* Main content centered */}
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 80px)", // subtract header height approx
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px", width: "100%" }}>{children}</div>
      </main>
    </div>
  );
};

export default GlobalLayout;
