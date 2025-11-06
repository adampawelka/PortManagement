import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { menuItems } from "../data/menus.js"; 
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { t } = useTranslation();
  const currentUserRole = "user"; // replace with actual user role
  const [expandedMenu, setExpandedMenu] = useState(null); // track which menu is expanded

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(currentUserRole)
  );

  const sidebarItems = filteredMenuItems.filter(
    (item) => item.section === "sidebar" || ["visualisation", "scheduling"].includes(item.key)
  );

  const handleToggle = (key) => {
    setExpandedMenu(expandedMenu === key ? null : key); // toggle
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <div key={item.key} className="sidebar-item">
            <div 
              className="sidebar-link-wrapper" 
              onClick={() => item.subMenu ? handleToggle(item.key) : null}
              style={{ cursor: item.subMenu ? "pointer" : "default" }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                {t(item.key)}
              </NavLink>
            </div>

            {/* Render submenu if it exists AND this menu is expanded */}
            {item.subMenu && item.subMenu.length > 0 && expandedMenu === item.key && (
              <div className="sidebar-submenu">
                {item.subMenu.map((sub) => (
                  <NavLink
                    key={sub.key}
                    to={sub.path}
                    className={({ isActive }) =>
                      isActive ? "sidebar-sublink active" : "sidebar-sublink"
                    }
                  >
                    {t(sub.name)}
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
