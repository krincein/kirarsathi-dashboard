import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { admin } from "../api/apiCall";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await admin.getUserCount();
        setStats(res?.data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
        <p>Loading dashboard...</p>
      </div>
    );

  if (!stats)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>Failed to load stats. Please try again.</h3>
      </div>
    );

  // Define dashboard cards
  const statCards = [
    { label: "Total Users", value: stats.totalUsers, color: "#1976d2", status: "all" },
    { label: "Active Users", value: stats.activeUsers, color: "#2e7d32", status: "active" },
    { label: "Blocked Users", value: stats.blockedUsers, color: "#d32f2f", status: "blocked" },
    { label: "Pending Users", value: stats.pendingUsers, color: "#ed6c02", status: "pending" },
    { label: "Married Users", value: stats.marriedUsers, color: "#6a1b9a", status: "married" },
    { label: "Muted Users", value: stats.mutedUsers, color: "#0288d1", status: "muted" },
  ];

  const handleCardClick = (status) => {
    navigate(`/users?status=${status}`);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Dashboard Overview</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            onClick={() => handleCardClick(stat.status)}
            sx={{
              minWidth: 220,
              background: stat.color,
              color: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)", opacity: 0.9 },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ opacity: 0.8 }}>
                {stat.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
