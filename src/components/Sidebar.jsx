import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { label: "Users", path: "/users", icon: <PeopleIcon /> },
  ];

  const handleLogout = () => {
    // ✅ Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // ✅ Redirect to login page
    navigate("/login");
  };

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
      <div>
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

      {/* ✅ Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          background: "transparent",
          color: "red",
          border: `1px solid red`,
          borderRadius: "8px",
          padding: "10px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          cursor: "pointer",
          marginTop: "auto",
          fontFamily: "base",
        }}
      >
        <LogoutIcon />
        Logout
      </button>
    </div>
  );
}
