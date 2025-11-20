import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Breadcrumbs.css"; // optional: create a CSS file for styling

const Breadcrumbs = () => {
  const { t } = useTranslation();
  const location = useLocation(); // Get current path
  const pathnames = location.pathname.split("/").filter(Boolean); // Split path into array

  return (
    <div className="breadcrumb-container">
      <Link to="/" className="breadcrumb-link">{t("home")}</Link>

      {pathnames.map((path, index) => {
        const linkPath = `/${pathnames.slice(0, index + 1).join("/")}`;
        return (
          <span key={index}>
            {" > "}
            <Link to={linkPath} className="breadcrumb-link">
              {t(formatBreadcrumbKey(path))}
            </Link>
          </span>
        );
      })}
    </div>
  );
};

// Helper function: convert path segment to translation key
const formatBreadcrumbKey = (path) => {
  return path
    .toLowerCase()
    .replace(/-/g, "_"); // e.g., "storage-areas" -> "storage_areas"
};

export default Breadcrumbs;

