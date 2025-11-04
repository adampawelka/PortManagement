import React from "react";
import logo from "../assets/logo.png"; // Put your logo image in src/assets/

const Header = () => {
    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%", 
                padding: "10px 20px",
                backgroundColor: "#f5f5f5",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                position: "sticky",
                top: 0,
                zIndex: 1000,
                width: "auto",           
                margin: "10px auto",
                borderRadius: "8px",     
            }}
        >
            <img
                src={logo}
                alt="Company Logo"
                style={{ height: "50px", marginRight: "15px" }}
            />

            <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Port Management Company</h1>
        </header>
    );
};

export default Header;