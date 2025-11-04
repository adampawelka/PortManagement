import React from "react";
import Header from "./Header";
import PrimaryNavigation from "./PrimaryNavigation";

const GlobalLayout = ({ children }) => {
  return (
    <div style={{ width: "100%", minHeight: "100vh", boxSizing: "border-box" }}>
      <Header />
      <PrimaryNavigation />

      {/* Main content centered */}
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
