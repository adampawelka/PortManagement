import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { menuItems } from "../data/menus.js"; // Import menu items
import { useUser } from "../App.jsx"; 
import "../styles/PrimaryNavigation.css"; // Import the CSS
import { useAuth0 } from '@auth0/auth0-react';


const PrimaryNavigation = () => {
  const { t } = useTranslation(); // Translation function
  const user = useUser(); 
  const currentUserRole = user?.role || null;
  
  // Filter menu items based on the user's role
  const filteredMenuItems = menuItems.filter(
    (item) => 
      (!item.roles || item.roles.includes(currentUserRole)) &&
      !["visualisation", "scheduling"].includes(item.key)
  );

  // Recursive function to render submenus
  const renderSubMenu = (subMenu) => {
    return (
      <div className="submenu">
        {subMenu.map((sub) => {
          if (sub.roles && !sub.roles.includes(currentUserRole)) return null;

          return (
            <div key={sub.key} className="submenu-item">
              <Link to={sub.path} className="submenu-link">
                {t(sub.key)}
              </Link>

              {/* Render nested submenus */}
              {sub.subMenu && sub.subMenu.length > 0 && (
                <div className="nested-submenu">
                  {renderSubMenu(sub.subMenu)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <nav className="nav">
  {filteredMenuItems.map((item) => {
    const hasSubMenu = item.subMenu && item.subMenu.length > 0;

    return (
      <div key={item.key} className="nav-item">

        {/* Jeśli ma submenu – nie robimy Link */}
        {hasSubMenu ? (
          <div className="nav-link no-link">
            {t(item.key)}
          </div>
        ) : (
          <Link to={item.path} className="nav-link">
            {t(item.key)}
          </Link>
        )}

        {/* Render submenu jeśli istnieje */}
        {hasSubMenu && (
          <div className="submenu-wrapper">
            {renderSubMenu(item.subMenu)}
          </div>
        )}
      </div>
    );
  })}
</nav>

  );
};

export default PrimaryNavigation;
