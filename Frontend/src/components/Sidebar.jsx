import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { menuItems } from "../data/menus.js"; 
import { useUser } from "../App.jsx"; 
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { t } = useTranslation();
  const user = useUser(); 
  const currentUserRole = user?.role || null;
  const [expandedMenu, setExpandedMenu] = useState(null);

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(currentUserRole)
  );

  const sidebarItems = filteredMenuItems.filter(
    (item) => item.section === "sidebar" || ["visualisation", "scheduling"].includes(item.key)
  );

  const handleToggle = (key) => {
    setExpandedMenu(expandedMenu === key ? null : key);
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <div key={item.key} className="sidebar-item">
            {/* Parent menu */}
            {item.subMenu && item.subMenu.length > 0 ? (
              <div
                className="sidebar-link clickable"
                onClick={() => handleToggle(item.key)}
                style={{ cursor: "pointer" }}
              >
                {t(item.key)}
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                {t(item.key)}
              </NavLink>
            )}

            {/* Render submenu if expanded */}
            {item.subMenu && expandedMenu === item.key && (
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
