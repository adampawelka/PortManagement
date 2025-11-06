import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { menuItems } from "../data/menus.js"; // reuse the same menu config
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { t } = useTranslation();
  const currentUserRole = "user"; // later you can replace this with actual user role

  // Filter menu items by role (like in PrimaryNavigation)
  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(currentUserRole)
  );

  // Optional: only show certain menu items in the sidebar (e.g., visualization/scheduling)
  const sidebarItems = filteredMenuItems.filter(
    (item) => item.section === "sidebar" || ["visualisation", "scheduling"].includes(item.key)
  );

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <div key={item.key} className="sidebar-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {t(item.key)}
            </NavLink>

            {/* Render submenus if they exist */}
            {item.subMenu && item.subMenu.length > 0 && (
              <div className="sidebar-submenu">
                {item.subMenu.map((sub) => (
                  <NavLink
                    key={sub.key}
                    to={sub.path}
                    className={({ isActive }) =>
                      isActive ? "sidebar-sublink active" : "sidebar-sublink"
                    }
                  >
                    {t(sub.key)}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
