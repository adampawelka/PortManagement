import React from "react";

const GlobalLayout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",   // vertical centering
        alignItems: "center",       // horizontal centering
        height: "100vh",            // full viewport height
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
        textAlign: "center",        // center text inside children
      }}
    >
      <main style={{ maxWidth: "600px", width: "100%" }}>
        {children}
      </main>
    </div>
  );
};

export default GlobalLayout;
