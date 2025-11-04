import React from "react";
import { Link } from "react-router-dom";
import { menuItems } from "../data/menus.js";
import "../styles/PrimaryNavigation.css"; // Import the CSS

const PrimaryNavigation = () => {
  return (
    <nav className="nav">
      {menuItems.map((item) => (
        <div key={item.name} className="nav-item">
          <Link to={item.path} className="nav-link">{item.name}</Link>

          {item.subMenu && item.subMenu.length > 0 && (
            <div className="submenu">
              {item.subMenu.map((sub) => (
                <div key={sub.name} className="submenu-item">
                  <Link to={sub.path} className="submenu-link">{sub.name}</Link>

                  {sub.subMenu && sub.subMenu.length > 0 && (
                    <div className="nested-submenu">
                      {sub.subMenu.map((nested) => (
                        <Link key={nested.name} to={nested.path} className="submenu-link">
                          {nested.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default PrimaryNavigation;
