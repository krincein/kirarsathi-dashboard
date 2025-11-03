import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { label: "Users", path: "/users", icon: <PeopleIcon /> },
    { label: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        background: "#1E1E2F",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "40px", color: "#00BFFF" }}>Kirar Sathi Admin</h2>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            textDecoration: "none",
            color: location.pathname === item.path ? "#00BFFF" : "#fff",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 0",
          }}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </div>
  );
}
