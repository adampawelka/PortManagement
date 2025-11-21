import React from "react";
import Header from "./Header";
import PrimaryNavigation from "./PrimaryNavigation";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import LanguageSwitcher from "./LanguageSwitcher";

const GlobalLayout = ({ children }) => {
  return (
    <div style={{ width: "100%", minHeight: "100vh", boxSizing: "border-box" }}>
      <Header />
      <PrimaryNavigation />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 20px" }}>
        <Breadcrumbs />
        <LanguageSwitcher />
      </div>


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
      <Footer />
    </div>
  );
};

export default GlobalLayout;
