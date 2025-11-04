import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation(); // Get the current location (URL path)
  const pathnames = location.pathname.split("/").filter(Boolean); // Split the path into an array

  return (
    <div style={breadcrumbContainerStyle}>
      <Link to="/" style={breadcrumbLinkStyle}>Home</Link> {/* Always start with Home */}

      {pathnames.map((path, index) => {
        const linkPath = `/${pathnames.slice(0, index + 1).join("/")}`; // Build the full path dynamically
        return (
          <span key={index}>
            {" > "}
            <Link to={linkPath} style={breadcrumbLinkStyle}>
              {capitalizeFirstLetter(path)}
            </Link>
          </span>
        );
      })}
    </div>
  );
};

// Helper function to capitalize the first letter of each breadcrumb
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Styles for breadcrumbs
const breadcrumbContainerStyle = {
  margin: "10px 0",
  fontSize: "14px",
  color: "#333",
};

const breadcrumbLinkStyle = {
  color: "#200963ff",
  textDecoration: "none",
  fontWeight: "bold",
};

export default Breadcrumbs;
