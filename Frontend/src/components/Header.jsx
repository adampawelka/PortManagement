import React from "react";
import logo from "../assets/logo.png";
import "../styles/variables.css"; // import variables
import "../styles/Header.css";    // import header-specific styles

const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="Company Logo" className="header-logo" />
      <h1 className="header-title">Port Management Company</h1>
    </header>
  );
};

export default Header;
