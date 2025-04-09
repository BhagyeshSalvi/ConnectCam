// src/pages/LoginPage.jsx
import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GlassCard = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(12px)",
  padding: "30px",
  borderRadius: "16px",
  color: "white",
  width: "100%",
  maxWidth: "400px",
  border: "1px solid rgba(255,255,255,0.1)",
}));

const LoginPage = ({onAuth}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onAuth(); // call this after saving token
      navigate("/main");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#141414",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <GlassCard elevation={6}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img src="/Logo.png" alt="ConnectCam" style={{ width: 150 }} />
        </Box>
        <Typography variant="h5" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
          Login to ConnectCam
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
          InputProps={{ style: { color: "white" } }}
        />
        <TextField
          label="Password"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2, borderRadius: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don’t have an account?{" "}
            <Link href="/signup" underline="hover">
              Sign up
            </Link>
          </Typography>
        </Box>
      </GlassCard>
    </Box>
  );
};

export default LoginPage;
