import React, { useState } from "react";
import {
  Paper, Typography, TextField, Button, Link,
  Box, Dialog, DialogTitle, DialogContent, IconButton, InputAdornment
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// ✅ Google Font
const fontFamily = `'Poppins', sans-serif`;

const GlassCard = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(12px)",
  padding: "30px",
  borderRadius: "16px",
  color: "white",
  width: "100%",
  maxWidth: "400px",
  border: "1px solid rgba(255,255,255,0.1)",
  fontFamily,
}));

const LoginPage = ({ onAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onAuth();
      navigate("/main");
    } catch (err) {
      const msg = err.response?.data?.msg || "Login failed";
      setErrorMessage(msg);
      setErrorDialogOpen(true);
    }
  };

  return (
    <>
      {/* ✅ Load Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />

      <Box sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        color: "white",
        padding: 2,
        fontFamily,
      }}>

        {/* ✅ LEFT PANEL - Features */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', px: 5 }}>
          <img src="/Logo.png" alt="ConnectCam Logo" style={{ width: 100, marginBottom: 16 }} />
          <Typography variant="h4" gutterBottom sx={{ fontFamily }}>ConnectCam</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>🚀 Real-time video calls</Typography>
          <Typography variant="body1">💬 Live captions & translations</Typography>
          <Typography variant="body1">🌐 Made with WebRTC, React, AssemblyAI</Typography>
          <Typography variant="body1">🔐 Secure & privacy-first</Typography>
          <Typography variant="caption" sx={{ mt: 4, color: 'rgba(255,255,255,0.7)' }}>
            Made with ❤️ by Bhagyesh Salvi
          </Typography>
        </Box>

        {/* ✅ RIGHT PANEL - Login */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
          }}
        >
          <GlassCard elevation={6}>
            <Typography variant="h5" gutterBottom sx={{ fontFamily }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ mb: 2, fontFamily }}>
              Login to ConnectCam
            </Typography>

            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)", fontFamily } }}
              InputProps={{ style: { color: "white", fontFamily } }}
            />

            <TextField
              label="Password"
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)", fontFamily } }}
              InputProps={{
                style: { color: "white", fontFamily },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "white" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, borderRadius: 2, fontFamily }}
              onClick={handleLogin}
            >
              Login
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" sx={{ fontFamily }}>
                Don’t have an account?{" "}
                <Link href="/signup" underline="hover" sx={{ color: '#90caf9' }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </GlassCard>
        </Box>

        {/* ❌ Error Dialog */}
        <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
          <DialogTitle sx={{ color: "red" }}>Login Failed</DialogTitle>
          <DialogContent>
            <Typography>{errorMessage}</Typography>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default LoginPage;
  