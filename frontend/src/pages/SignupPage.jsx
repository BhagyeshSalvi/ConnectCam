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

const SignupPage = ({onAuth}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // Clear error on input
  };

  const handleSignup = async () => {
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("https://connectcam-backend.onrender.com/api/signup", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onAuth();
      navigate("/main");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
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
          Create Account
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
          Sign up for ConnectCam
        </Typography>

        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          margin="normal"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!error}
          helperText={error}
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2, borderRadius: 2 }}
          onClick={handleSignup}
        >
          Sign Up
        </Button>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Login
            </Link>
          </Typography>
        </Box>
      </GlassCard>
    </Box>
  );
};

export default SignupPage;
