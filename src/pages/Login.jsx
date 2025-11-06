import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { auth } from "../api/apiCall"; // your axios setup file
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { email, password } = formValues;
      if (!email || !password) {
        setError("Please enter email and password");
        setLoading(false);
        return;
      }

      const response = await auth.login({
        email,
        password,
      });

      // Save token + user in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      navigate("/");
    } catch (err) {
      setError(err || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)",
      }}
    >
      <Box
        sx={{
          background: "white",
          p: 4,
          borderRadius: 3,
          width: 350,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
          Login to Dashboard
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email or Phone"
            name="email"
            value={formValues.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3, borderRadius: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Typography
            mt={2}
            textAlign="center"
            fontSize={14}
            sx={{ cursor: "pointer", color: "primary.main" }}
            onClick={() => navigate("/register")}
          >
            Don't have an account? Register
          </Typography>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
