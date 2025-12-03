import React from "react";
import Header from "./Header";
import PrimaryNavigation from "./PrimaryNavigation";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

const GlobalLayout = () => {
  return (
    <div style={{ width: "100%", minHeight: "100vh", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      <Header />
      <PrimaryNavigation />

      {/* Główna sekcja: sidebar + reszta */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar z lewej strony */}
        <Sidebar />

        {/* Reszta kontentu po prawej stronie */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Pasek breadcrumb + język */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px",
              borderBottom: '1px solid #eee' // Separador visual
            }}
          >
            <Breadcrumbs />
            <LanguageSwitcher />
          </div>

          {/* Główna treść */}
          <main
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "0px 20px 65px 20px",
              textAlign: "center",
              
            }}
          >
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto'}}><Outlet /></div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GlobalLayout;
