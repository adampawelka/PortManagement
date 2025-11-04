import React from "react";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p style={textStyle}>&copy; 2025 Port Management System</p>
      <p style={textStyle}>
        <a href="/privacy" style={linkStyle}>Privacy Policy</a> | 
        <a href="/terms" style={linkStyle}>Terms of Service</a>
      </p>
    </footer>
  );
};

// Footer Styles
const footerStyle = {
  width: "100%",
  backgroundColor: "#200963ff",
  color: "white",
  padding: "10px 0",  // Reduced padding for a smaller footer
  textAlign: "center",
  position: "fixed",
  bottom: 0,
  fontSize: "12px",  // Smaller font size
};

const textStyle = {
  margin: "0",  // Removes default margin around text
  padding: "0", // Removes padding around text
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  margin: "0 5px",
  fontSize: "12px",  // Smaller link font size
};

export default Footer;
