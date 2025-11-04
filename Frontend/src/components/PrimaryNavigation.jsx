import React from "react";
import { Link } from "react-router-dom";
import { menuItems } from "../data/menus.js"; // Import menu items
import "../styles/PrimaryNavigation.css"; // Import the CSS

const PrimaryNavigation = () => {
  const currentUserRole = "user"; // Example: Change this to "admin", "user", or "guest"

  // Filter menu items based on the user's role
  const filteredMenuItems = menuItems.filter((item) => {
    return !item.roles || item.roles.includes(currentUserRole); // Show item if the user's role matches
  });

  // Recursive function to render submenus
  const renderSubMenu = (subMenu) => {
    return (
      <div className="submenu">
        {subMenu.map((sub) => {
          // Filter submenus based on role
          if (sub.roles && !sub.roles.includes(currentUserRole)) {
            return null; // If the user doesn't have permission, skip this submenu item
          }
          return (
            <div key={sub.name} className="submenu-item">
              <Link to={sub.path} className="submenu-link">{sub.name}</Link>

              {/* Render nested submenus */}
              {sub.subMenu && sub.subMenu.length > 0 && (
                <div className="nested-submenu">
                  {renderSubMenu(sub.subMenu)} {/* Recursively render nested submenus */}
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
      {filteredMenuItems.map((item) => (
        <div key={item.name} className="nav-item">
          <Link to={item.path} className="nav-link">{item.name}</Link>

          {/* Render submenu if it exists */}
          {item.subMenu && item.subMenu.length > 0 && (
            <div className="submenu-wrapper">
              {renderSubMenu(item.subMenu)} {/* Recursively render submenus */}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default PrimaryNavigation;
