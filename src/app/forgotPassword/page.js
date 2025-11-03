"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import AppTitle from "@/components/AppTitle";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleResetPassword = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "If an account exists with this email, a password reset link has been sent."
      );
    } catch (err) {
      if ((err.code = "auth/invalid-email")) {
        setError("Failed to send reset email. Please check the address.");
      }
      console.error("Reset error:", err);
    }
  };

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <AppTitle />
      <Paper
        elevation={isSmall ? 0 : 3}
        sx={{
          p: 4,
          mt: 3,
          maxWidth: "25rem",
          width: "100%",
          textAlign: "center",
          m: "24px auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Forgot Password
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your registered email address. We’ll send you a password reset
          link.
        </Typography>

        <TextField
          fullWidth
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
        />

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        {message && (
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            {message}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleResetPassword}
        >
          Send Reset Link
        </Button>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "gray",
          }}
        >
          Remember your password?
          <Button onClick={() => router.push("/login")}>Login</Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
