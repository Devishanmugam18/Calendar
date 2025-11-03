"use client";

import {
  Box,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import GoogleLogo from "../../assets/Google-G-logo.svg";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import { useState } from "react";
import { Email, Password } from "@mui/icons-material";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "@mui/material/Link";
import AppTitle from "@/components/AppTitle";
import Icon from "@mui/material/Icon";

export default function Register() {
  const [userCredential, setUserCredential] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCredential({
      ...userCredential,
      [name]: value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const newErrors = {};

    //Email validation
    if (!userCredential.email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(userCredential.email)) {
      newErrors.email = "Invalid email address";
    }

    //password validation
    if (!userCredential.password) {
      newErrors.password = "Password is required.";
    } else if (userCredential.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (!userCredential.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (userCredential.password !== userCredential.confirmPassword) {
      newErrors.confirmPassword = "Password not matched";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          userCredential.email,
          userCredential.password
        );
        console.log("user created", user);
        router.push("/calendar");
      } catch (error) {
        console.log("Error Signing up : ", error.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("signwithpop return rsult", result);
      router.push("/calendar");
    } catch (error) {
      console.log("Error Google Login:", error.message);
    }
  };
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
        elevation={isSmall ? 0 : 2}
        sx={{
          m: "10px auto",
          mt: { xs: 0, sm: 4, md: 4, lg: 3 },
          p: 3,
          maxWidth: "23rem",
          borderRadius: "10px",
        }}
      >
        <form onSubmit={handleSignUp}>
          <TextField
            id="email"
            placeholder="Email address"
            variant="outlined"
            fullWidth
            name="email"
            value={userCredential.email}
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              },
            }}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <TextField
            type={isVisible ? "text" : "password"}
            id="password"
            placeholder="Password"
            variant="outlined"
            name="password"
            value={userCredential.password}
            fullWidth
            onChange={handleChange}
            sx={{ mt: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </InputAdornment>
                ),
              },
            }}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />

          <TextField
            type={isVisible ? "text" : "password"}
            placeholder="Confirm password"
            variant="outlined"
            name="confirmPassword"
            value={userCredential.confirmPassword}
            fullWidth
            onChange={handleChange}
            sx={{ mt: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </InputAdornment>
                ),
              },
            }}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
          />

          <Button sx={{ mt: 2 }} variant="contained" type="submit" fullWidth>
            Sign Up
          </Button>

          <Typography
            sx={{
              display: "flex",
              justifyContent: "space-around",
              color: "gray",
              mt: 1,
            }}
          >
            Or
          </Typography>
        </form>
        <Button
          variant="outlined"
          onClick={handleGoogleLogin}
          fullWidth
          startIcon={
            <Image src={GoogleLogo} alt="Google logo" width="20" height="20" />
          }
          sx={{ mt: 1 }}
        >
          Continue with Google
        </Button>
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "gray",
            mt: 1,
          }}
        >
          Already have an account?
          <Button onClick={() => router.push("/login")}>Login</Button>
        </Typography>
      </Paper>
    </Box>
  );
}
